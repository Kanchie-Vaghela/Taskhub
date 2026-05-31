create table jobs (
    id uuid primary key default gen_random_uuid(),
    task_id uuid references tasks(id) on delete cascade,
    status text default 'queued',
    created_at timestamp default now(),
    completed_at timestamp
);