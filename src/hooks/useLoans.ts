import { useState, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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

export interface Investment {
  id: string
  loan_id: string
  lender_address: string
  amount: number
  interest_rate: number
  expected_return: number
  status: 'active' | 'repaid' | 'defaulted'
  created_at: string
}

async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    if (!response.ok) throw new Error('API request failed')
    return response.json()
  } catch (err) {
    console.error(`API error (${endpoint}):`, err)
    return null
  }
}

// Mock data for when API is unavailable
const mockLoans: Loan[] = [
  { id: '1', borrower_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f12eB1', borrower_name: 'Amara Okafor', business_type: 'Textile Manufacturing', loan_amount: 5000, interest_rate: 8, description: 'Expanding textile production with new equipment', funded_amount: 3750, funded_percentage: 75, status: 'active', created_at: new Date().toISOString() },
  { id: '2', borrower_address: '0x8Ba1f109551bD432803012645Hac136E765C6d61', borrower_name: 'Carlos Mendez', business_type: 'Agricultural Cooperative', loan_amount: 3500, interest_rate: 7, description: 'Modernizing farming techniques', funded_amount: 3220, funded_percentage: 92, status: 'active', created_at: new Date().toISOString() },
  { id: '3', borrower_address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9', borrower_name: 'Fatima Hassan', business_type: 'Digital Services', loan_amount: 2000, interest_rate: 6, description: 'Building a tech consulting firm', funded_amount: 900, funded_percentage: 45, status: 'active', created_at: new Date().toISOString() },
]

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchAPI('/api/loans')
      
      if (data && Array.isArray(data) && data.length > 0) {
        setLoans(data)
      } else {
        console.log('Using mock loan data')
        setLoans(mockLoans)
      }
    } catch (err: any) {
      setError(err.message)
      setLoans(mockLoans)
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
        body: JSON.stringify(application),
      })
      
      if (data) {
        return { success: true, data }
      }
      // Mock success
      return { success: true, data: { ...application, id: crypto.randomUUID(), status: 'pending', created_at: new Date().toISOString() } }
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

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(false)

  const createInvestment = async (investment: { loan_id: string; lender_address: string; amount: number; interest_rate: number }) => {
    try {
      setLoading(true)
      const data = await fetchAPI('/api/investments', {
        method: 'POST',
        body: JSON.stringify(investment),
      })
      
      if (data) {
        return { success: true, data }
      }
      // Mock success
      return { success: true, data: { ...investment, id: crypto.randomUUID(), expected_return: investment.amount * (1 + investment.interest_rate / 100), status: 'active', created_at: new Date().toISOString() } }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const fetchInvestments = async (address: string) => {
    try {
      setLoading(true)
      const data = await fetchAPI(`/api/investments?address=${address}`)
      if (data) {
        setInvestments(data)
      }
    } catch (err) {
      console.error('Failed to fetch investments:', err)
    } finally {
      setLoading(false)
    }
  }

  return { investments, loading, createInvestment, fetchInvestments }
}
