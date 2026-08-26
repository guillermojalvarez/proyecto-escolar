-- Portal escolar — Esc. Sec. Guillermo J. Alvarez Briseño
-- Esquema inicial estilo Lexo (auth + profiles + dominio escolar)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('padre', 'asesor', 'direccion')),
  display_name text not null,
  email text,
  alumno_clave text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alumnos (
  id text primary key,
  nombre text not null,
  grupo text not null,
  asesor text not null,
  clave_unica text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tutores_alumnos (
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  alumno_id text not null references public.alumnos(id) on delete cascade,
  primary key (tutor_id, alumno_id)
);

create table if not exists public.calificaciones (
  id bigserial primary key,
  alumno_id text not null references public.alumnos(id) on delete cascade,
  materia text not null,
  p1 numeric(4,2),
  p2 numeric(4,2),
  p3 numeric(4,2),
  unique (alumno_id, materia)
);

create table if not exists public.asistencias (
  id bigserial primary key,
  alumno_id text not null references public.alumnos(id) on delete cascade,
  grupo text,
  fecha date not null,
  estado text not null check (estado in ('presente', 'falta', 'retardo')),
  registrado_por uuid references public.profiles(id),
  unique (alumno_id, fecha)
);

create table if not exists public.avisos (
  id bigserial primary key,
  tipo text not null check (tipo in ('urgente', 'evento', 'info')),
  titulo text not null,
  cuerpo text not null,
  fecha text,
  created_at timestamptz not null default now()
);

create table if not exists public.eventos_agenda (
  id bigserial primary key,
  fecha text not null,
  dia text,
  titulo text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reportes_conducta (
  id bigserial primary key,
  alumno_id text not null references public.alumnos(id) on delete cascade,
  tipo text not null check (tipo in ('positivo', 'negativo')),
  fecha text,
  titulo text not null,
  detalle text,
  reporta text,
  created_at timestamptz not null default now()
);

create table if not exists public.mensajes_chat (
  id bigserial primary key,
  alumno_id text not null references public.alumnos(id) on delete cascade,
  de text not null check (de in ('padre', 'asesor')),
  texto text not null,
  hora text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.alumnos enable row level security;
alter table public.tutores_alumnos enable row level security;
alter table public.calificaciones enable row level security;
alter table public.asistencias enable row level security;
alter table public.avisos enable row level security;
alter table public.eventos_agenda enable row level security;
alter table public.reportes_conducta enable row level security;
alter table public.mensajes_chat enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "alumnos_select_authenticated" on public.alumnos;
create policy "alumnos_select_authenticated"
  on public.alumnos for select to authenticated
  using (true);

drop policy if exists "tutores_select_own" on public.tutores_alumnos;
create policy "tutores_select_own"
  on public.tutores_alumnos for select to authenticated
  using (tutor_id = auth.uid());

drop policy if exists "calificaciones_select_authenticated" on public.calificaciones;
create policy "calificaciones_select_authenticated"
  on public.calificaciones for select to authenticated
  using (true);

drop policy if exists "asistencias_select_authenticated" on public.asistencias;
create policy "asistencias_select_authenticated"
  on public.asistencias for select to authenticated
  using (true);

drop policy if exists "asistencias_write_authenticated" on public.asistencias;
create policy "asistencias_write_authenticated"
  on public.asistencias for all to authenticated
  using (true)
  with check (true);

drop policy if exists "avisos_select_authenticated" on public.avisos;
create policy "avisos_select_authenticated"
  on public.avisos for select to authenticated
  using (true);

drop policy if exists "eventos_select_authenticated" on public.eventos_agenda;
create policy "eventos_select_authenticated"
  on public.eventos_agenda for select to authenticated
  using (true);

drop policy if exists "conducta_select_authenticated" on public.reportes_conducta;
create policy "conducta_select_authenticated"
  on public.reportes_conducta for select to authenticated
  using (true);

drop policy if exists "chat_select_authenticated" on public.mensajes_chat;
create policy "chat_select_authenticated"
  on public.mensajes_chat for select to authenticated
  using (true);

drop policy if exists "chat_insert_authenticated" on public.mensajes_chat;
create policy "chat_insert_authenticated"
  on public.mensajes_chat for insert to authenticated
  with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_role text := coalesce(new.raw_user_meta_data->>'role', 'padre');
begin
  if new_role not in ('padre', 'asesor', 'direccion') then
    new_role := 'padre';
  end if;

  insert into public.profiles (id, role, display_name, email, alumno_clave)
  values (
    new.id,
    new_role,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    case
      when new_role = 'padre' then coalesce(new.raw_user_meta_data->>'alumno_clave', 'GAB-2026-0451')
      else null
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
