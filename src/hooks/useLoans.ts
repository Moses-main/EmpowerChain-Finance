import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Loan {
  id: string
  borrower_address: string
  borrower_name: string
  business_type: string
  loan_amount: number
  interest_rate: number
  description: string
  funded_percentage: number
  status: 'active' | 'funded' | 'repaid' | 'defaulted'
  created_at: string
}

export interface LoanApplication {
  id?: string
  borrower_address: string
  borrower_name: string
  email: string
  business_type: string
  loan_amount: number
  loan_purpose: string
  business_description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoans = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLoans(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [])

  return { loans, loading, error, refetch: fetchLoans }
}

export function useLoanApplications(walletAddress?: string) {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitApplication = async (application: Omit<LoanApplication, 'id' | 'created_at' | 'status'>) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([{ ...application, status: 'pending' }])
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const fetchMyApplications = async (address: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('borrower_address', address)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { applications, loading, error, submitApplication, fetchMyApplications }
}
