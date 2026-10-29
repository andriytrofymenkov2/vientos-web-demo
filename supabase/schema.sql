-- =============================================================================
-- VIENTOS GYM · Esquema SQL para conectar la web y el panel admin con Supabase
-- Ejecutá este script una sola vez (después de los scripts de la app) en el SQL Editor de tu proyecto de Supabase.
-- Va en el MISMO proyecto de Supabase que la app de socios (vientos-gym).
-- Cualquiera puede LEER el contenido de la web, solo UNA cuenta puede EDITARLA:
-- grupoamplifia@gmail.com (la cuenta administradora de la app). Nadie más.
-- =============================================================================

-- Contenido de la web (horarios, shop, servicios, planes y convenios)
create table if not exists public.vientos_web_contenido (
  id text primary key default 'principal',
  datos jsonb not null default '{}'::jsonb,
  actualizado_en timestamptz not null default now(),
  actualizado_por uuid references auth.users(id) on delete set null
);

-- Quién puede editar la web: solo la cuenta grupoamplifia@gmail.com, con el email confirmado.
-- El email se lee de auth.users (no del token), así que nadie puede hacerse pasar por ella.
-- Los socios, los profes y los demás administradores de la app no pueden editar.
create or replace function public.es_admin_web()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid()
      and lower(u.email) = 'grupoamplifia@gmail.com'
      and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.es_admin_web() from public;
grant execute on function public.es_admin_web() to anon, authenticated;

alter table public.vientos_web_contenido enable row level security;
grant select on public.vientos_web_contenido to anon, authenticated;
grant insert, update on public.vientos_web_contenido to authenticated;

drop policy if exists "Lectura publica de contenido web" on public.vientos_web_contenido;
create policy "Lectura publica de contenido web"
  on public.vientos_web_contenido for select
  to anon, authenticated
  using (true);

drop policy if exists "Escritura admin autenticado" on public.vientos_web_contenido;
drop policy if exists "Escritura admin web" on public.vientos_web_contenido;
create policy "Escritura solo administradores web"
  on public.vientos_web_contenido for all
  to authenticated
  using (public.es_admin_web())
  with check (public.es_admin_web());

-- Fotos de productos y disciplinas
insert into storage.buckets (id, name, public)
values ('vientos-web', 'vientos-web', true)
on conflict (id) do nothing;

drop policy if exists "Fotos web publicas" on storage.objects;
create policy "Fotos web publicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'vientos-web');

drop policy if exists "Admin sube fotos web" on storage.objects;
create policy "Admin sube fotos web"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vientos-web' and public.es_admin_web());

drop policy if exists "Admin actualiza fotos web" on storage.objects;
create policy "Admin actualiza fotos web"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vientos-web' and public.es_admin_web());

-- Para comprobar: con la sesión de grupoamplifia@gmail.com, select public.es_admin_web() tiene que dar true.
