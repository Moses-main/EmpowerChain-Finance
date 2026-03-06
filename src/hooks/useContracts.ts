import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useCallback, useState } from 'react'
import { contractAddresses, loanAbi, lendingAbi, literacyBadgeAbi, usdcAbi } from './contracts'

export function useLoanContract() {
  const { writeContractAsync, isPending: isWriting } = useWriteContract()
  const [txHash, setTxHash] = useState<string | null>(null)

  const createLoan = useCallback(async (
    borrowerName: string,
    amount: bigint,
    interestRate: bigint,
    duration: bigint,
    purpose: string,
    description: string
  ) => {
    const hash = await writeContractAsync({
      address: contractAddresses.loan,
      abi: loanAbi,
      functionName: 'createLoan',
      args: [borrowerName, amount, interestRate, duration, purpose, description],
    })
    setTxHash(hash)
    return hash
  }, [writeContractAsync])

  const approveLoan = useCallback(async (loanId: `0x${string}`) => {
    const hash = await writeContractAsync({
      address: contractAddresses.loan,
      abi: loanAbi,
      functionName: 'approveLoan',
      args: [loanId],
    })
    setTxHash(hash)
    return hash
  }, [writeContractAsync])

  const fundLoan = useCallback(async (loanId: `0x${string}`, value: bigint) => {
    const hash = await writeContractAsync({
      address: contractAddresses.loan,
      abi: loanAbi,
      functionName: 'fundLoan',
      args: [loanId],
      value,
    })
    setTxHash(hash)
    return hash
  }, [writeContractAsync])

  const repayLoan = useCallback(async (loanId: `0x${string}`, value: bigint) => {
    const hash = await writeContractAsync({
      address: contractAddresses.loan,
      abi: loanAbi,
      functionName: 'repayLoan',
      args: [loanId],
      value,
    })
    setTxHash(hash)
    return hash
  }, [writeContractAsync])

  return {
    createLoan,
    approveLoan,
    fundLoan,
    repayLoan,
    isWriting,
    txHash,
  }
}

export function useReadLoanContract() {
  const getActiveLoans = useReadContract({
    address: contractAddresses.loan,
    abi: loanAbi,
    functionName: 'getActiveLoans',
  })

  const getLoan = useReadContract({
    address: contractAddresses.loan,
    abi: loanAbi,
    functionName: 'getLoan',
  })

  const getBorrowerLoans = useReadContract({
    address: contractAddresses.loan,
    abi: loanAbi,
    functionName: 'getBorrowerLoans',
  })

  const calculateTotalRepayment = useReadContract({
    address: contractAddresses.loan,
    abi: loanAbi,
    functionName: 'calculateTotalRepayment',
  })

  return {
    getActiveLoans,
    getLoan,
    getBorrowerLoans,
    calculateTotalRepayment,
  }
}

export function useLendingContract() {
  const { writeContractAsync, isPending: isWriting } = useWriteContract()
  const [txHash, setTxHash] = useState<string | null>(null)

  const invest = useCallback(async (loanId: `0x${string}`, amount: bigint) => {
    const hash = await writeContractAsync({
      address: contractAddresses.lending,
      abi: lendingAbi,
      functionName: 'invest',
      args: [loanId, amount],
    })
    setTxHash(hash)
    return hash
  }, [writeContractAsync])

  return {
    invest,
    isWriting,
    txHash,
  }
}

export function useReadLendingContract() {
  const { address } = useAccount()

  const getLenderInvestments = useReadContract({
    address: contractAddresses.lending,
    abi: lendingAbi,
    functionName: 'getLenderInvestments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const getInvestment = useReadContract({
    address: contractAddresses.lending,
    abi: lendingAbi,
    functionName: 'getInvestment',
  })

  const calculateReturns = useReadContract({
    address: contractAddresses.lending,
    abi: lendingAbi,
    functionName: 'calculateReturns',
  })

  return {
    getLenderInvestments,
    getInvestment,
    calculateReturns,
  }
}

export function useLiteracyBadge() {
  const { writeContractAsync, isPending: isWriting } = useWriteContract()
  const [txHash, setTxHash] = useState<string | null>(null)

  const mintBadge = useCallback(async (to: `0x${string}`, tier: number) => {
    const hash = await writeContractAsync({
      address: contractAddresses.literacyBadge,
      abi: literacyBadgeAbi,
      functionName: 'mintBadge',
      args: [to, tier],
    })
    setTxHash(hash)
    return hash
  }, [writeContractAsync])

  return {
    mintBadge,
    isWriting,
    txHash,
  }
}

export function useReadLiteracyBadge() {
  const { address } = useAccount()

  const getUserBadge = useReadContract({
    address: contractAddresses.literacyBadge,
    abi: literacyBadgeAbi,
    functionName: 'getUserBadge',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const balanceOf = useReadContract({
    address: contractAddresses.literacyBadge,
    abi: literacyBadgeAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return {
    getUserBadge,
    balanceOf,
  }
}

export function useUSDC() {
  const { writeContractAsync, isPending: isWriting } = useWriteContract()

  const approve = useCallback(async (spender: `0x${string}`, amount: bigint) => {
    const hash = await writeContractAsync({
      address: contractAddresses.usdc,
      abi: usdcAbi,
      functionName: 'approve',
      args: [spender, amount],
    })
    return hash
  }, [writeContractAsync])

  const transfer = useCallback(async (to: `0x${string}`, amount: bigint) => {
    const hash = await writeContractAsync({
      address: contractAddresses.usdc,
      abi: usdcAbi,
      functionName: 'transfer',
      args: [to, amount],
    })
    return hash
  }, [writeContractAsync])

  return {
    approve,
    transfer,
    isWriting,
  }
}

export function useReadUSDC() {
  const { address } = useAccount()

  const balanceOf = useReadContract({
    address: contractAddresses.usdc,
    abi: usdcAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const allowance = useReadContract({
    address: contractAddresses.usdc,
    abi: usdcAbi,
    functionName: 'allowance',
    args: address && contractAddresses.loan ? [address, contractAddresses.loan] : undefined,
    query: {
      enabled: !!address && contractAddresses.loan !== '0x0000000000000000000000000000000000000000',
    },
  })

  return {
    balanceOf,
    allowance,
  }
}

export function useWaitForTransaction() {
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: undefined as unknown as `0x${string}`,
  })

  return { isConfirming, isSuccess }
}
