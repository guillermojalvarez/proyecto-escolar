-- Seed demo — Escuela Secundaria Guillermo J. Alvarez Briseño
-- Ejecutar DESPUÉS de 20260803000000_portal_escolar.sql en el SQL Editor.
-- Los usuarios Auth se crean en el Dashboard (ver README); luego corre link_demo_users.sql.

truncate table public.mensajes_chat restart identity cascade;
truncate table public.reportes_conducta restart identity cascade;
truncate table public.asistencias restart identity cascade;
truncate table public.calificaciones restart identity cascade;
truncate table public.tutores_alumnos cascade;
truncate table public.eventos_agenda restart identity cascade;
truncate table public.avisos restart identity cascade;
truncate table public.alumnos cascade;

-- clave_unica es UNIQUE: la clave familiar va solo en un alumno (h1)
insert into public.alumnos (id, nombre, grupo, asesor, clave_unica) values
  ('h1', 'Mateo Domínguez', '2°B', 'Profa. Karla Reyes', 'GAB-2026-0451'),
  ('h2', 'Regina Domínguez', '1°A', 'Prof. Iván Torres', null),
  ('a2', 'Ana Sofía Delgado', '2°B', 'Profa. Karla Reyes', null),
  ('a3', 'Bruno Castillo', '2°B', 'Profa. Karla Reyes', null),
  ('a4', 'Camila Rivas', '2°B', 'Profa. Karla Reyes', null),
  ('a5', 'Diego Salcedo', '2°B', 'Profa. Karla Reyes', null),
  ('a6', 'Elena Márquez', '2°B', 'Profa. Karla Reyes', null),
  ('a7', 'Fernando Ibarra', '2°B', 'Profa. Karla Reyes', null),
  ('a8', 'Gael Ponce', '2°B', 'Profa. Karla Reyes', null);

insert into public.calificaciones (alumno_id, materia, p1, p2, p3) values
  ('h1', 'Español', 8.6, 9.0, 8.8),
  ('h1', 'Matemáticas', 7.2, 6.4, 7.0),
  ('h1', 'Ciencias', 9.1, 8.9, 9.3),
  ('h1', 'Historia', 8.0, 8.4, 8.2),
  ('h1', 'Inglés', 9.5, 9.4, 9.6),
  ('h1', 'Formación Cívica', 8.8, 9.0, 8.9),
  ('h1', 'Ed. Física', 10, 9.8, 10),
  ('h1', 'Artes', 8.3, 8.5, 8.7),
  ('h2', 'Español', 9.2, 9.1, 9.4),
  ('h2', 'Matemáticas', 5.8, 6.2, 6.9),
  ('h2', 'Ciencias', 8.4, 8.6, 8.5),
  ('h2', 'Historia', 9.0, 8.8, 9.1),
  ('h2', 'Inglés', 8.7, 8.9, 9.0),
  ('h2', 'Formación Cívica', 9.3, 9.2, 9.4),
  ('h2', 'Ed. Física', 9.6, 9.7, 9.8),
  ('h2', 'Artes', 9.0, 9.2, 9.1);

insert into public.avisos (tipo, titulo, cuerpo, fecha) values
  ('urgente', 'Suspensión de clases el viernes 10',
   'Por junta de consejo técnico escolar no habrá clases este día.', '07 jul'),
  ('evento', 'Junta de padres de familia — 2°B',
   'Se entregarán boletas del segundo periodo. Salón 2B, 6:00 pm.', '12 jul'),
  ('info', 'Recordatorio: pago de colegiatura',
   'Fecha límite sin recargo, 15 de julio.', '15 jul');

insert into public.eventos_agenda (fecha, dia, titulo) values
  ('07 jul', 'Mar', 'Entrega de trabajo — Ciencias'),
  ('10 jul', 'Vie', 'Sin clases (consejo técnico)'),
  ('12 jul', 'Dom', 'Junta de padres 2°B, 6:00 pm'),
  ('18 jul', 'Sáb', 'Examen bimestral — Matemáticas'),
  ('22 jul', 'Mié', 'Entrega de boletas');

insert into public.reportes_conducta (alumno_id, tipo, fecha, titulo, detalle, reporta) values
  ('h1', 'positivo', '03 jul', 'Participación destacada en Ciencias',
   'Apoyó a sus compañeros durante la práctica de laboratorio.', 'Profa. Karla Reyes'),
  ('h1', 'negativo', '28 jun', 'Tareas incompletas',
   'No entregó la tarea de Matemáticas por segunda vez en la semana.', 'Profa. Karla Reyes'),
  ('h2', 'positivo', '01 jul', 'Representó a la escuela en oratoria',
   'Obtuvo segundo lugar en el concurso zonal de oratoria.', 'Prof. Iván Torres');

insert into public.asistencias (alumno_id, grupo, fecha, estado) values
  ('h1', '2°B', '2026-07-03', 'falta'),
  ('h1', '2°B', '2026-07-07', 'retardo'),
  ('h1', '2°B', '2026-07-09', 'falta'),
  ('h2', '1°A', '2026-07-06', 'retardo');

insert into public.mensajes_chat (alumno_id, de, texto, hora) values
  ('h1', 'asesor', 'Buenas tardes, le comparto que Mateo mejoró bastante en Ciencias este periodo.', '10:12'),
  ('h1', 'padre', 'Qué buena noticia, gracias por avisarme. ¿Cómo lo vio en Matemáticas?', '10:15'),
  ('h1', 'asesor', 'Ahí le falta un poco de constancia con la tarea, pero vamos a reforzarlo esta semana.', '10:16'),
  ('h2', 'asesor', 'Le escribo para comentarle que Regina participó en el concurso de oratoria.', '09:02'),
  ('h2', 'padre', '¡No lo sabía! ¿Cómo le fue?', '09:20');
