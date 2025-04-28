/*
  # Add user requests tracking

  1. New Tables
    - `user_requests`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_requests` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS user_requests (
    id bigint primary key generated always as identity,
    user_id uuid references auth.users(id) not null unique,
    count integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own request count"
    ON user_requests
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own request count"
    ON user_requests
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());