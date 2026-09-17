HRMS Admin - Supabase Connected Version

This ZIP is based on the uploaded HRMS-admin-main project.

CONNECTED NOW
- Supabase client: src/lib/supabase.ts
- Employee Management: live SELECT + INSERT against public.hrms_employees
- Complete Add Employee form mapped to the Supabase table
- Refresh, search, filters, table/grid, and profile details use live employee records

NOT YET CONVERTED
- Other Admin modules in this uploaded project still use their existing mock/server data.
- Payroll remains mock in this version; its Supabase schema can be added next.

SETUP
1. Extract this project.
2. Run: npm install
3. Copy .env.example to .env.local
4. Put your Supabase URL and publishable key in .env.local:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
5. In Supabase SQL Editor, run supabase_hrms_employee_setup.sql.
6. Run: npm run dev
7. Open Employee Management.
8. Click Add Employee and submit a test employee.
9. Verify:
   SELECT * FROM public.hrms_employees ORDER BY created_at DESC;

IMPORTANT
The included RLS policies are development/testing policies. They allow anon SELECT/INSERT.
For production HRMS data, use Supabase Auth and restrictive RLS policies by role.
Never put a Supabase secret/service_role key in the Vite browser environment.
