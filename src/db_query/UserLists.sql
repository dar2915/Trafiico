create table public."UserLists" (
    id uuid not null,
    last_name character varying null,
    first_name character varying null,
    gender character varying null,
    birth_date date null,
    address text null,
    phone_number character varying null,
    email text null,
    password text null,
    date_registered timestamp without time zone null,
    role text null default 'passenger' :: text,
    constraint UserLists_pkey primary key (id),
    constraint public_UserLists_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;