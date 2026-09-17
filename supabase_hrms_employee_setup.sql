-- HRMS Supabase setup for Employee Management
-- Run this in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.hrms_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_code text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  avatar text,
  designation text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  joining_date date NOT NULL,
  employment_type text NOT NULL CHECK (employment_type IN ('FULL_TIME','CONTRACT','PROBATION','INTERN')),
  reporting_manager text,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','ON_LEAVE','PROBATION','NOTICE_PERIOD')),
  ctc numeric(12,2) NOT NULL DEFAULT 0,
  pan_number text,
  uan_number text,
  bank_name text,
  bank_account_number text,
  bank_ifsc text,
  bank_branch text,
  emergency_name text,
  emergency_relation text,
  emergency_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hrms_employees ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.hrms_employees TO anon;
GRANT SELECT, INSERT ON public.hrms_employees TO authenticated;

DROP POLICY IF EXISTS "Allow HRMS employee read" ON public.hrms_employees;
DROP POLICY IF EXISTS "Allow HRMS employee insert" ON public.hrms_employees;

CREATE POLICY "Allow HRMS employee read"
ON public.hrms_employees FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow HRMS employee insert"
ON public.hrms_employees FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Verify
SELECT * FROM public.hrms_employees ORDER BY created_at DESC;
