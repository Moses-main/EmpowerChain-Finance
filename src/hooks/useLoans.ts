import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export interface Loan {
  id: string
  borrower_address: string
  borrower_name: string
  business_type: string
  loan_amount: number
  interest_rate: number
  description: string
  funded_amount: number
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

async function fetchAPI(endpoint: string, options?: RequestInit) {
  if (!API_URL) {
    console.warn('VITE_API_URL not configured, using mock data')
    return null
  }
  const response = await fetch(`${API_URL}${endpoint}`, options)
  if (!response.ok) throw new Error('API request failed')
  return response.json()
}

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchAPI('/api/loans')
      
      if (data) {
        setLoans(data)
      } else {
        // Mock data when API not available
        setLoans([
          { id: '1', borrower_address: '0x123', borrower_name: 'Amara Okafor', business_type: 'Textile Manufacturing', loan_amount: 5000, interest_rate: 8, description: 'Expanding textile production', funded_amount: 3750, funded_percentage: 75, status: 'active', created_at: new Date().toISOString() },
          { id: '2', borrower_address: '0x456', borrower_name: 'Carlos Mendez', business_type: 'Agricultural Cooperative', loan_amount: 3500, interest_rate: 7, description: 'Modernizing farming', funded_amount: 3220, funded_percentage: 92, status: 'active', created_at: new Date().toISOString() },
          { id: '3', borrower_address: '0x789', borrower_name: 'Fatima Hassan', business_type: 'Digital Services', loan_amount: 2000, interest_rate: 6, description: 'Tech consulting firm', funded_amount: 900, funded_percentage: 45, status: 'active', created_at: new Date().toISOString() },
        ])
      }
    } catch (err: any) {
      setError(err.message)
      // Fallback to mock data
      setLoans([
        { id: '1', borrower_address: '0x123', borrower_name: 'Amara Okafor', business_type: 'Textile Manufacturing', loan_amount: 5000, interest_rate: 8, description: 'Expanding textile production', funded_amount: 3750, funded_percentage: 75, status: 'active', created_at: new Date().toISOString() },
        { id: '2', borrower_address: '0x456', borrower_name: 'Carlos Mendez', business_type: 'Agricultural Cooperative', loan_amount: 3500, interest_rate: 7, description: 'Modernizing farming', funded_amount: 3220, funded_percentage: 92, status: 'active', created_at: new Date().toISOString() },
        { id: '3', borrower_address: '0x789', borrower_name: 'Fatima Hassan', business_type: 'Digital Services', loan_amount: 2000, interest_rate: 6, description: 'Tech consulting firm', funded_amount: 900, funded_percentage: 45, status: 'active', created_at: new Date().toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  return { loans, loading, error, refetch: fetchLoans }
}

export function useLoanApplications() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitApplication = async (application: Omit<LoanApplication, 'id' | 'created_at' | 'status'>) => {
    try {
      setLoading(true)
      const data = await fetchAPI('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      })
      
      if (data) {
        return { success: true, data }
      }
      // Mock success when API not available
      return { success: true, data: { ...application, id: crypto.randomUUID(), status: 'pending' } }
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
      const data = await fetchAPI(`/api/applications?address=${address}`)
      if (data) {
        setApplications(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { applications, loading, error, submitApplication, fetchMyApplications }
}

export function useInvestments(walletAddress?: string) {
  const [investments, setInvestments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchInvestments = useCallback(async () => {
    if (!walletAddress) return
    try {
      setLoading(true)
      const data = await fetchAPI(`/api/investments?address=${walletAddress}`)
      if (data) {
        setInvestments(data)
      }
    } catch (err) {
      console.error('Failed to fetch investments:', err)
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    fetchInvestments()
  }, [fetchInvestments])

  return { investments, loading, refetch: fetchInvestments }
}
