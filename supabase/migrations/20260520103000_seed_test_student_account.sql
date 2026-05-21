-- Seed a read-only demo student account for staging/demo environments.
-- Auth Email: test@dormr.app
-- University Email: test@dormr.university.local (synthetic but valid-looking university domain)
-- Password: DormrTest123!

DO $$
DECLARE
  v_email constant text := 'test@dormr.app';
  v_university_email constant text := 'test@dormr.university.local';
  v_user_id uuid;
BEGIN
  -- Look up the auth user ID by email (must be created manually via Supabase dashboard)
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Auth user % not found. Create it via Supabase dashboard first (email: %, password: DormrTest123!).', v_email, v_email;
  END IF;

  -- Ensure student profile exists and is marked complete for dashboard access.
  INSERT INTO public.student_profiles (
    id,
    full_name,
    gender,
    university_name,
    year_of_study,
    major,
    sleep_schedule,
    cleanliness,
    noise_level,
    guests_frequency,
    study_location,
    smoking,
    pets,
    diet_preference,
    hobbies,
    profile_completed,
    email_verified,
    university_email,
    bio,
    phone
  )
  VALUES (
    v_user_id,
    'Dormr Test User',
    'male',
    'University of Manchester',
    '2nd_year',
    'Computer Science',
    'flexible',
    3,
    'moderate',
    'sometimes',
    'both',
    false,
    false,
    'no_preference',
    ARRAY['Reading', 'Gym', 'Music']::text[],
    true,
    true,
    v_university_email,
    'Demo account for read-only walkthroughs.',
    NULL
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    university_name = EXCLUDED.university_name,
    major = EXCLUDED.major,
    profile_completed = true,
    updated_at = now();
END;
$$;
