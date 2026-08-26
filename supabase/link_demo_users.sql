-- Vincular usuarios Auth demo con perfiles / tutores.
-- 1) En Authentication → Users crea estos 3 usuarios (Auto Confirm User = ON):
--    padre@gab.demo      / Demo123456!   User Metadata: {"role":"padre","name":"Familia Domínguez"}
--    asesor@gab.demo     / Demo123456!   User Metadata: {"role":"asesor","name":"Profa. Karla Reyes"}
--    direccion@gab.demo  / Demo123456!   User Metadata: {"role":"direccion","name":"Dirección escolar"}
-- 2) Ejecuta este script en el SQL Editor.

update public.profiles p
set
  role = coalesce(u.raw_user_meta_data->>'role', p.role),
  display_name = coalesce(u.raw_user_meta_data->>'name', p.display_name),
  email = u.email,
  alumno_clave = case
    when coalesce(u.raw_user_meta_data->>'role', '') = 'padre' then 'GAB-2026-0451'
    else p.alumno_clave
  end,
  updated_at = now()
from auth.users u
where p.id = u.id
  and u.email in ('padre@gab.demo', 'asesor@gab.demo', 'direccion@gab.demo');

-- Por si el trigger no corrió al crear el usuario
insert into public.profiles (id, role, display_name, email, alumno_clave)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'role', 'padre'),
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.email,
  case when coalesce(u.raw_user_meta_data->>'role', '') = 'padre' then 'GAB-2026-0451' else null end
from auth.users u
where u.email in ('padre@gab.demo', 'asesor@gab.demo', 'direccion@gab.demo')
on conflict (id) do update set
  role = excluded.role,
  display_name = excluded.display_name,
  email = excluded.email,
  alumno_clave = excluded.alumno_clave,
  updated_at = now();

delete from public.tutores_alumnos ta
using public.profiles p
where ta.tutor_id = p.id
  and p.email = 'padre@gab.demo';

insert into public.tutores_alumnos (tutor_id, alumno_id)
select p.id, a.id
from public.profiles p
cross join public.alumnos a
where p.email = 'padre@gab.demo'
  and a.id in ('h1', 'h2');
