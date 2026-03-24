-- Extensions
create extension if not exists pgcrypto;

-- Enums (idempotent)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('user', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
  end if;

  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('cod', 'bkash');
  end if;
end
$$;

-- Updated-at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Admin helper for RLS checks
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  image_url text,
  file_url text,
  is_active boolean not null default true,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_address text,
  total_price numeric(12,2) not null check (total_price >= 0),
  payment_status public.payment_status not null default 'pending',
  payment_method public.payment_method,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies (drop + recreate for repeatable migration)
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;

drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

drop policy if exists "Authenticated users can read own orders" on public.orders;
drop policy if exists "Checkout can insert orders" on public.orders;
drop policy if exists "Admins can update any order" on public.orders;

drop policy if exists "Order items readable by order owner or admin" on public.order_items;
drop policy if exists "Checkout can insert order items" on public.order_items;
drop policy if exists "Admins can update order items" on public.order_items;
drop policy if exists "Admins can delete order items" on public.order_items;

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles
for select
using (public.is_admin());

create policy "Public can read active products"
on public.products
for select
using (is_active = true or public.is_admin());

create policy "Admins can insert products"
on public.products
for insert
with check (public.is_admin());

create policy "Admins can update products"
on public.products
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete products"
on public.products
for delete
using (public.is_admin());

create policy "Authenticated users can read own orders"
on public.orders
for select
using (user_id = auth.uid() or public.is_admin());

create policy "Checkout can insert orders"
on public.orders
for insert
to anon, authenticated
with check (
  (auth.uid() is null and user_id is null)
  or (auth.uid() is not null and (user_id is null or user_id = auth.uid()))
);

create policy "Admins can update any order"
on public.orders
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Order items readable by order owner or admin"
on public.order_items
for select
using (
  public.is_admin() or exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  )
);

create policy "Checkout can insert order items"
on public.order_items
for insert
to anon, authenticated
with check (exists (select 1 from public.orders o where o.id = order_items.order_id));

create policy "Admins can update order items"
on public.order_items
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete order items"
on public.order_items
for delete
using (public.is_admin());

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do nothing;

-- Storage policies (drop + recreate)
drop policy if exists "Public read product images" on storage.objects;
drop policy if exists "Admins manage product images" on storage.objects;
drop policy if exists "Admins manage product files" on storage.objects;
drop policy if exists "Buyers can read paid product files" on storage.objects;

create policy "Public read product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

create policy "Admins manage product images"
on storage.objects
for all
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins manage product files"
on storage.objects
for all
to authenticated
using (bucket_id = 'product-files' and public.is_admin())
with check (bucket_id = 'product-files' and public.is_admin());

create policy "Buyers can read paid product files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-files'
  and exists (
    select 1
    from public.products p
    join public.order_items oi on oi.product_id = p.id
    join public.orders o on o.id = oi.order_id
    where o.user_id = auth.uid()
      and o.payment_status = 'paid'
      and p.file_url is not null
      and p.file_url = (storage.objects.bucket_id || '/' || storage.objects.name)
  )
);

-- Payment architecture extensions
alter table public.orders
  add column if not exists payment_reference text,
  add column if not exists paid_at timestamptz;

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null,
  payment_method public.payment_method,
  transaction_id text,
  amount numeric(12,2),
  currency text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_payment_events_order_id on public.payment_events(order_id);
create index if not exists idx_payment_events_event_type on public.payment_events(event_type);

alter table public.payment_events enable row level security;

drop policy if exists "Admins can read payment events" on public.payment_events;
create policy "Admins can read payment events"
on public.payment_events
for select
using (public.is_admin());
