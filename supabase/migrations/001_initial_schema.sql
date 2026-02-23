-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address VARCHAR(66) UNIQUE,
  full_name VARCHAR(255),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan applications from borrowers
CREATE TABLE IF NOT EXISTS public.loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_address VARCHAR(66) NOT NULL,
  borrower_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  loan_amount DECIMAL(18, 2) NOT NULL,
  loan_purpose TEXT,
  business_description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'funded', 'repaid', 'defaulted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active loans that can be funded by lenders
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_address VARCHAR(66) NOT NULL,
  borrower_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(255) NOT NULL,
  loan_amount DECIMAL(18, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  description TEXT,
  funded_amount DECIMAL(18, 2) DEFAULT 0,
  funded_percentage INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'funded', 'repaid', 'defaulted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lender investments
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  lender_address VARCHAR(66) NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  expected_return DECIMAL(18, 2),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'repaid', 'defaulted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed literacy modules (NFT badges)
CREATE TABLE IF NOT EXISTS public.completed_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address VARCHAR(66) NOT NULL,
  module_id VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  nft_badge VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_address, module_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON public.loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_borrower ON public.loan_applications(borrower_address);
CREATE INDEX IF NOT EXISTS idx_loans_status ON public.loans(status);
CREATE INDEX IF NOT EXISTS idx_investments_loan ON public.investments(loan_id);
CREATE INDEX IF NOT EXISTS idx_investments_lender ON public.investments(lender_address);
CREATE INDEX IF NOT EXISTS idx_completed_modules_user ON public.completed_modules(user_address);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Loan applications: Anyone can apply, users can view their own
CREATE POLICY "Anyone can apply for loan" ON public.loan_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own applications" ON public.loan_applications
  FOR SELECT USING (borrower_address = (SELECT wallet_address FROM public.profiles WHERE id = auth.uid()));

-- Loans: Anyone can view active loans
CREATE POLICY "Anyone can view active loans" ON public.loans
  FOR SELECT USING (status = 'active' OR status = 'funded');

-- Investments: Users can view their own investments
CREATE POLICY "Users can view own investments" ON public.investments
  FOR SELECT USING (lender_address = (SELECT wallet_address FROM public.profiles WHERE id = auth.uid()));

-- Completed modules: Users can view their own
CREATE POLICY "Users can view own modules" ON public.completed_modules
  FOR SELECT USING (user_address = (SELECT wallet_address FROM public.profiles WHERE id = auth.uid()));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
