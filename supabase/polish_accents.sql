-- Opcional: acentos y grupos correctos en datos ya cargados (demo)
update public.alumnos set
  nombre = case id
    when 'h1' then 'Mateo Domínguez'
    when 'h2' then 'Regina Domínguez'
    when 'a2' then 'Ana Sofía Delgado'
    when 'a6' then 'Elena Márquez'
    else nombre
  end,
  grupo = case
    when grupo in ('2B', '2°B') then '2°B'
    when grupo in ('1A', '1°A') then '1°A'
    else grupo
  end,
  asesor = case id
    when 'h2' then 'Prof. Iván Torres'
    else asesor
  end
where id in ('h1','h2','a2','a3','a4','a5','a6','a7','a8');

update public.calificaciones set
  materia = case materia
    when 'Espanol' then 'Español'
    when 'Matematicas' then 'Matemáticas'
    when 'Ingles' then 'Inglés'
    when 'Formacion Civica' then 'Formación Cívica'
    when 'Ed. Fisica' then 'Ed. Física'
    else materia
  end;

update public.profiles set
  display_name = case email
    when 'padre@gab.demo' then 'Familia Domínguez'
    when 'direccion@gab.demo' then 'Dirección escolar'
    else display_name
  end
where email in ('padre@gab.demo', 'direccion@gab.demo');

update public.avisos set
  titulo = replace(titulo, 'Suspension', 'Suspensión'),
  cuerpo = replace(replace(cuerpo, 'habra', 'habrá'), 'tecnico', 'técnico');
