import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const ALLOW_MOCK_LOANS = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_LOANS === 'true'
const POLLING_INTERVAL = 30000 // 30 seconds

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

interface FetchApiResult<T = unknown> {
  ok: boolean
  status: number
  data: T | null
  message: string | null
}

async function fetchAPI<T = unknown>(endpoint: string, options?: RequestInit): Promise<FetchApiResult<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = 'API request failed'
      try {
        const payload = await response.json()
        errorMessage = payload?.error?.message || payload?.message || errorMessage
      } catch {
        // fall back to default message when body is not json
      }

      return {
        ok: false,
        status: response.status,
        data: null,
        message: errorMessage,
      }
    }

    const data = (await response.json()) as T
    return {
      ok: true,
      status: response.status,
      data,
      message: null,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: 'Unable to reach API service',
    }
  }
}

// Mock data for development fallback only (VITE_ENABLE_MOCK_LOANS=true)
const mockLoans: Loan[] = [
  { id: '1', borrower_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f12eB1', borrower_name: 'Amara Okafor', business_type: 'Textile Manufacturing', loan_amount: 5000, interest_rate: 8, description: 'Expanding textile production with new equipment', funded_amount: 3750, funded_percentage: 75, status: 'active', created_at: new Date().toISOString() },
  { id: '2', borrower_address: '0x8Ba1f109551bD432803012645Hac136E765C6d61', borrower_name: 'Carlos Mendez', business_type: 'Agricultural Cooperative', loan_amount: 3500, interest_rate: 7, description: 'Modernizing farming techniques', funded_amount: 3220, funded_percentage: 92, status: 'active', created_at: new Date().toISOString() },
  { id: '3', borrower_address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9', borrower_name: 'Fatima Hassan', business_type: 'Digital Services', loan_amount: 2000, interest_rate: 6, description: 'Building a tech consulting firm', funded_amount: 900, funded_percentage: 45, status: 'active', created_at: new Date().toISOString() },
]

async function fetchLoans(): Promise<Loan[]> {
  const response = await fetchAPI<Loan[]>('/api/loans')
  
  if (response.ok && Array.isArray(response.data)) {
    return response.data
  }
  
  if (ALLOW_MOCK_LOANS) {
    return mockLoans
  }
  
  throw new Error(response.message || 'Failed to load loans')
}

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: fetchLoans,
    refetchInterval: POLLING_INTERVAL,
    staleTime: POLLING_INTERVAL / 2,
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: ['loan', id],
    queryFn: async () => {
      const response = await fetchAPI<Loan>(`/api/loans/${id}`)
      if (response.ok && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Loan not found')
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!id,
  })
}

export function useLoanApplications(address?: string) {
  return useQuery({
    queryKey: ['applications', address],
    queryFn: async () => {
      if (!address) return []
      const response = await fetchAPI<LoanApplication[]>(`/api/applications?address=${address}`)
      if (response.ok && Array.isArray(response.data)) {
        return response.data
      }
      return []
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!address,
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (application: Omit<LoanApplication, 'id' | 'created_at' | 'status'>) => {
      const response = await fetchAPI<LoanApplication>('/api/applications', {
        method: 'POST',
        body: JSON.stringify(application),
      })
      
      if (!response.ok || !response.data) {
        throw new Error(response.message || 'Failed to submit application')
      }
      
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useInvestments(address?: string) {
  return useQuery({
    queryKey: ['investments', address],
    queryFn: async () => {
      if (!address) return []
      const response = await fetchAPI<Investment[]>(`/api/investments?address=${address}`)
      if (response.ok && Array.isArray(response.data)) {
        return response.data
      }
      return []
    },
    refetchInterval: POLLING_INTERVAL,
    enabled: !!address,
  })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (investment: { loan_id: string; lender_address: string; amount: number; interest_rate: number }) => {
      const response = await fetchAPI<Investment>('/api/investments', {
        method: 'POST',
        body: JSON.stringify(investment),
      })
      
      if (!response.ok || !response.data) {
        throw new Error(response.message || 'Failed to create investment')
      }
      
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] })
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

// Hook for manual refetch
export function useRefreshLoans() {
  const queryClient = useQueryClient()
  
  return {
    refresh: () => queryClient.invalidateQueries({ queryKey: ['loans'] }),
    refreshLoan: (id: string) => queryClient.invalidateQueries({ queryKey: ['loan', id] }),
    refreshApplications: (address?: string) => queryClient.invalidateQueries({ queryKey: ['applications', address] }),
    refreshInvestments: (address?: string) => queryClient.invalidateQueries({ queryKey: ['investments', address] }),
  }
}
