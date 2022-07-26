create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists app_user(
    uuid uuid default uuid_generate_v4(),
    username varchar not null,
    password varchar not null,
    primary key (uuid)
)

insert into app_user (username, password) values ('Pessoa1', crypt('admin', 'my_salt'));