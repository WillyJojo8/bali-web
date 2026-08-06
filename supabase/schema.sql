-- ============================================================
--  Bali · esquema de base de datos
--  Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

-- ---------- Quién puede administrar ----------
-- Solo los correos de esta tabla entran al panel.
create table if not exists admins (
  email       text primary key,
  nombre      text,
  creado_en   timestamptz not null default now()
);

-- ¡CAMBIA ESTOS CORREOS POR LOS VUESTROS!
insert into admins (email, nombre) values
  ('tu-correo@gmail.com', 'Guille'),
  ('el-otro-correo@gmail.com', 'La otra persona')
on conflict (email) do nothing;

create or replace function es_admin()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from admins
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- ---------- Cupones ----------
create table if not exists cupones (
  id          uuid primary key default gen_random_uuid(),
  marca       text not null,
  valor       text not null,          -- "15", "5"
  unidad      text not null default '% dto',
  codigo      text not null,
  que         text,                   -- "Arneses y correas"
  url         text,
  destacado   boolean not null default false,
  activo      boolean not null default true,
  caduca      date,                   -- null = no caduca
  orden       int not null default 0,
  creado_en   timestamptz not null default now()
);

-- ---------- Entradas del blog ----------
create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  titulo       text not null,
  resumen      text not null,
  cuerpo       text not null default '',   -- markdown
  portada_url  text,
  portada_alt  text,
  etiquetas    text[] not null default '{}',
  tipo         text not null default 'dia-a-dia'
               check (tipo in ('resena','dia-a-dia','consejos','colaboracion')),
  patrocinado  boolean not null default false,
  publicado    boolean not null default false,
  fecha        timestamptz not null default now(),
  autor_email  text,
  creado_en    timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists posts_publicado_fecha_idx
  on posts (publicado, fecha desc);

-- ---------- Opiniones de producto ----------
create table if not exists opiniones (
  id          uuid primary key default gen_random_uuid(),
  producto    text not null,
  marca       text,
  nota        int not null check (nota between 1 and 5),
  texto       text not null,
  foto_url    text,
  cupon_id    uuid references cupones(id) on delete set null,
  publicada   boolean not null default true,
  creado_en   timestamptz not null default now()
);

-- ---------- Actualizar la marca de tiempo sola ----------
create or replace function toca_actualizado()
returns trigger language plpgsql as $$
begin
  new.actualizado_en = now();
  return new;
end $$;

drop trigger if exists posts_actualizado on posts;
create trigger posts_actualizado
  before update on posts
  for each row execute function toca_actualizado();

-- ============================================================
--  Seguridad a nivel de fila (RLS)
--  Lectura pública SOLO de lo publicado. Escritura solo admins.
-- ============================================================
alter table cupones   enable row level security;
alter table posts     enable row level security;
alter table opiniones enable row level security;
alter table admins    enable row level security;

drop policy if exists cupones_lectura on cupones;
create policy cupones_lectura on cupones
  for select using (activo = true and (caduca is null or caduca >= current_date));

drop policy if exists cupones_admin on cupones;
create policy cupones_admin on cupones
  for all using (es_admin()) with check (es_admin());

drop policy if exists posts_lectura on posts;
create policy posts_lectura on posts
  for select using (publicado = true);

drop policy if exists posts_admin on posts;
create policy posts_admin on posts
  for all using (es_admin()) with check (es_admin());

drop policy if exists opiniones_lectura on opiniones;
create policy opiniones_lectura on opiniones
  for select using (publicada = true);

drop policy if exists opiniones_admin on opiniones;
create policy opiniones_admin on opiniones
  for all using (es_admin()) with check (es_admin());

drop policy if exists admins_lectura on admins;
create policy admins_lectura on admins
  for select using (es_admin());

-- ============================================================
--  Almacenamiento de fotos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists fotos_lectura on storage.objects;
create policy fotos_lectura on storage.objects
  for select using (bucket_id = 'fotos');

drop policy if exists fotos_escritura on storage.objects;
create policy fotos_escritura on storage.objects
  for insert with check (bucket_id = 'fotos' and es_admin());

drop policy if exists fotos_borrado on storage.objects;
create policy fotos_borrado on storage.objects
  for delete using (bucket_id = 'fotos' and es_admin());
