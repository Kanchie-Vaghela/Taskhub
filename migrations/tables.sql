create table users (
    id uuid primary key,
    email text unique not null,
    name text,
    role text default 'user',
    created_at timestamp default now()
);

create table tasks (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    status text default 'pending',
    assigned_to uuid references users(id),
    created_by uuid references users(id),
    product_image_url text,
    created_at timestamp default now()
);

create table generated_images (
    id uuid primary key default gen_random_uuid(),
    task_id uuid references tasks(id) on delete cascade,
    image_type text,
    image_url text,
    prompt_used text,
    angle text,
    metadata jsonb,
    created_at timestamp default now()
);

create table audit_logs (
    id uuid primary key default gen_random_uuid(),
    action text not null,
    table_name text not null,
    record_id text,
    user_id uuid references users(id),
    created_at timestamp default now()
);