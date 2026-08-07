-- ============================================================
--  Migración 002 · categoría y fecha de verificación en cupones
--
--  Ejecutar en Supabase → SQL Editor → New query → Run.
--  Se puede ejecutar dos veces sin romper nada.
--
--  Para qué sirve cada columna:
--
--  · categoria    — agrupa los cupones en la web (accesorios, comida,
--                   higiene, juguetes, camas, salud, otros) y es lo que
--                   mueven los filtros de /codigos/. Los valores válidos
--                   están en src/lib/seo.ts, en CATEGORIAS.
--
--  · verificado_en — el día que comprobaste a mano que el código funciona.
--                   Sale en cada cupón como "verificado hace tres días".
--                   Es la diferencia entre esta web y las páginas de
--                   cupones llenas de códigos muertos de 2019, y lo que
--                   hace que la gente vuelva.
-- ============================================================

alter table cupones add column if not exists categoria text not null default 'otros';
alter table cupones add column if not exists verificado_en date;

-- Hay tiendas que no dicen cuánto descuenta el código hasta que lo aplicas.
-- Antes `valor` era obligatorio y había que inventarse una cifra.
alter table cupones alter column valor drop not null;

-- Los cupones que ya existían no tienen fecha de comprobación. Se les pone
-- la de hoy: están en la web, luego se dan por buenos hoy.
update cupones set verificado_en = current_date where verificado_en is null;

-- Solo las categorías que entiende la web. Si algún día se añade una nueva
-- en src/lib/seo.ts, hay que añadirla también aquí.
alter table cupones drop constraint if exists cupones_categoria_valida;
alter table cupones add constraint cupones_categoria_valida
  check (categoria in ('accesorios','comida','higiene','juguetes','camas','salud','otros'));

-- El listado público ordena por destacado y orden, y filtra por categoría.
create index if not exists cupones_categoria_idx on cupones (categoria);

-- ------------------------------------------------------------
--  Comprobación: esto debería devolver las columnas nuevas.
-- ------------------------------------------------------------
-- select column_name, data_type from information_schema.columns
--   where table_name = 'cupones' and column_name in ('categoria','verificado_en');
