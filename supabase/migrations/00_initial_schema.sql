-- ApplyMate Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  headline TEXT,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_id UNIQUE(user_id)
);

-- 2. Companies Table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  industry TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Applications Table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  position TEXT NOT NULL,
  location TEXT,
  employment_type TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'IDR',
  job_url TEXT,
  job_source TEXT,
  job_description TEXT,
  status TEXT DEFAULT 'wishlist',
  priority TEXT DEFAULT 'medium',
  applied_at TIMESTAMPTZ,
  follow_up_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Application Timeline Table
CREATE TABLE public.application_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Interviews Table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  duration INTEGER, -- in minutes
  meeting_url TEXT,
  interviewer_name TEXT,
  interviewer_role TEXT,
  notes TEXT,
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Interview Questions Table
CREATE TABLE public.interview_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Resumes Table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  version TEXT,
  target_role TEXT,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Application Resumes Table (Many-to-Many)
CREATE TABLE public.application_resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, resume_id)
);

-- 9. Reminders Table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reminder_date TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Setup Row Level Security (RLS)

-- Helper function to enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 2. Companies Policies
CREATE POLICY "Users can view own companies" ON public.companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own companies" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own companies" ON public.companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own companies" ON public.companies FOR DELETE USING (auth.uid() = user_id);

-- 3. Applications Policies
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON public.applications FOR DELETE USING (auth.uid() = user_id);

-- 4. Application Timeline Policies
CREATE POLICY "Users can view own timelines" ON public.application_timeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own timelines" ON public.application_timeline FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own timelines" ON public.application_timeline FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own timelines" ON public.application_timeline FOR DELETE USING (auth.uid() = user_id);

-- 5. Interviews Policies
CREATE POLICY "Users can view own interviews" ON public.interviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON public.interviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interviews" ON public.interviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interviews" ON public.interviews FOR DELETE USING (auth.uid() = user_id);

-- 6. Interview Questions Policies
-- (Complex RLS since user_id isn't directly on the table, it relates via interviews)
CREATE POLICY "Users can view own interview questions" ON public.interview_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = interview_questions.interview_id AND interviews.user_id = auth.uid())
);
CREATE POLICY "Users can insert own interview questions" ON public.interview_questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = interview_questions.interview_id AND interviews.user_id = auth.uid())
);
CREATE POLICY "Users can update own interview questions" ON public.interview_questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = interview_questions.interview_id AND interviews.user_id = auth.uid())
);
CREATE POLICY "Users can delete own interview questions" ON public.interview_questions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.interviews WHERE interviews.id = interview_questions.interview_id AND interviews.user_id = auth.uid())
);

-- 7. Resumes Policies
CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- 8. Application Resumes Policies
CREATE POLICY "Users can view own application_resumes" ON public.application_resumes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.applications WHERE applications.id = application_resumes.application_id AND applications.user_id = auth.uid())
);
CREATE POLICY "Users can insert own application_resumes" ON public.application_resumes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.applications WHERE applications.id = application_resumes.application_id AND applications.user_id = auth.uid())
);
CREATE POLICY "Users can delete own application_resumes" ON public.application_resumes FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.applications WHERE applications.id = application_resumes.application_id AND applications.user_id = auth.uid())
);

-- 9. Reminders Policies
CREATE POLICY "Users can view own reminders" ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON public.reminders FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to automatically create profile for new auth user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
