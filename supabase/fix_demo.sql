-- Reparación limpia (clave familiar solo en h1)

delete from public.mensajes_chat;
delete from public.reportes_conducta;
delete from public.asistencias;
delete from public.calificaciones;
delete from public.tutores_alumnos;
delete from public.eventos_agenda;
delete from public.avisos;
delete from public.alumnos;

insert into public.profiles (id, role, display_name, email, alumno_clave)
values
  ('c453e3ad-1c1c-4d2f-9724-2425961497e6', 'padre', 'Familia Dominguez', 'padre@gab.demo', 'GAB-2026-0451'),
  ('bb3c779a-23f8-47da-b2de-56e4eb29fd0b', 'asesor', 'Profa. Karla Reyes', 'asesor@gab.demo', null),
  ('a0d20655-d243-4918-9a5a-aeed58971615', 'direccion', 'Direccion escolar', 'direccion@gab.demo', null)
on conflict (id) do update set
  role = excluded.role,
  display_name = excluded.display_name,
  email = excluded.email,
  alumno_clave = excluded.alumno_clave,
  updated_at = now();

insert into public.alumnos (id, nombre, grupo, asesor, clave_unica) values
  ('h1', 'Mateo Dominguez', '2B', 'Profa. Karla Reyes', 'GAB-2026-0451'),
  ('h2', 'Regina Dominguez', '1A', 'Prof. Ivan Torres', null),
  ('a2', 'Ana Sofia Delgado', '2B', 'Profa. Karla Reyes', null),
  ('a3', 'Bruno Castillo', '2B', 'Profa. Karla Reyes', null),
  ('a4', 'Camila Rivas', '2B', 'Profa. Karla Reyes', null),
  ('a5', 'Diego Salcedo', '2B', 'Profa. Karla Reyes', null),
  ('a6', 'Elena Marquez', '2B', 'Profa. Karla Reyes', null),
  ('a7', 'Fernando Ibarra', '2B', 'Profa. Karla Reyes', null),
  ('a8', 'Gael Ponce', '2B', 'Profa. Karla Reyes', null);

insert into public.calificaciones (alumno_id, materia, p1, p2, p3) values
  ('h1', 'Espanol', 8.6, 9.0, 8.8),
  ('h1', 'Matematicas', 7.2, 6.4, 7.0),
  ('h1', 'Ciencias', 9.1, 8.9, 9.3),
  ('h1', 'Historia', 8.0, 8.4, 8.2),
  ('h1', 'Ingles', 9.5, 9.4, 9.6),
  ('h1', 'Formacion Civica', 8.8, 9.0, 8.9),
  ('h1', 'Ed. Fisica', 10, 9.8, 10),
  ('h1', 'Artes', 8.3, 8.5, 8.7),
  ('h2', 'Espanol', 9.2, 9.1, 9.4),
  ('h2', 'Matematicas', 5.8, 6.2, 6.9),
  ('h2', 'Ciencias', 8.4, 8.6, 8.5),
  ('h2', 'Historia', 9.0, 8.8, 9.1),
  ('h2', 'Ingles', 8.7, 8.9, 9.0),
  ('h2', 'Formacion Civica', 9.3, 9.2, 9.4),
  ('h2', 'Ed. Fisica', 9.6, 9.7, 9.8),
  ('h2', 'Artes', 9.0, 9.2, 9.1);

insert into public.avisos (tipo, titulo, cuerpo, fecha) values
  ('urgente', 'Suspension de clases el viernes 10', 'Por junta de consejo tecnico no habra clases.', '07 jul'),
  ('evento', 'Junta de padres 2B', 'Entrega de boletas. Salon 2B, 6:00 pm.', '12 jul'),
  ('info', 'Pago de colegiatura', 'Fecha limite sin recargo, 15 de julio.', '15 jul');

insert into public.eventos_agenda (fecha, dia, titulo) values
  ('07 jul', 'Mar', 'Entrega de trabajo Ciencias'),
  ('10 jul', 'Vie', 'Sin clases (consejo tecnico)'),
  ('12 jul', 'Dom', 'Junta de padres 2B'),
  ('18 jul', 'Sab', 'Examen Matematicas'),
  ('22 jul', 'Mie', 'Entrega de boletas');

insert into public.reportes_conducta (alumno_id, tipo, fecha, titulo, detalle, reporta) values
  ('h1', 'positivo', '03 jul', 'Participacion en Ciencias', 'Apoyo a companeros en laboratorio.', 'Profa. Karla Reyes'),
  ('h1', 'negativo', '28 jun', 'Tareas incompletas', 'No entrego tarea de Matematicas.', 'Profa. Karla Reyes'),
  ('h2', 'positivo', '01 jul', 'Oratoria', 'Segundo lugar en concurso zonal.', 'Prof. Ivan Torres');

insert into public.asistencias (alumno_id, grupo, fecha, estado) values
  ('h1', '2B', '2026-07-03', 'falta'),
  ('h1', '2B', '2026-07-07', 'retardo'),
  ('h1', '2B', '2026-07-09', 'falta'),
  ('h2', '1A', '2026-07-06', 'retardo');

insert into public.mensajes_chat (alumno_id, de, texto, hora) values
  ('h1', 'asesor', 'Buenas tardes, Mateo mejoro en Ciencias.', '10:12'),
  ('h1', 'padre', 'Gracias. Como va en Matematicas?', '10:15'),
  ('h1', 'asesor', 'Le falta constancia con la tarea.', '10:16'),
  ('h2', 'asesor', 'Regina participo en oratoria.', '09:02'),
  ('h2', 'padre', 'Como le fue?', '09:20');

insert into public.tutores_alumnos (tutor_id, alumno_id) values
  ('c453e3ad-1c1c-4d2f-9724-2425961497e6', 'h1'),
  ('c453e3ad-1c1c-4d2f-9724-2425961497e6', 'h2')
on conflict do nothing;
