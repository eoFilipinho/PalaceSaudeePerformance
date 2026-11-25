-- Desconto (%) por produto, editável no painel admin.
alter table public.products
  add column if not exists discount_percent integer not null default 0
  check (discount_percent between 0 and 90);

-- Passa para o banco as promoções que estavam fixas no código.
update public.products set discount_percent = 5  where name = 'Granola Artesanal';
update public.products set discount_percent = 8  where name = 'Vitamina C Natural';
update public.products set discount_percent = 15 where name = 'Whey Vegetal';
