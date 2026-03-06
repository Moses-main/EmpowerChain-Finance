import express from 'express'
import pg from 'pg'
import cors from 'cors'
import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const app = express()
const { Pool } = pg

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const ENV = process.env.NODE_ENV || 'development'

function getSslConfig() {
  const sslMode = process.env.DB_SSL_MODE || (ENV === 'production' ? 'require' : 'disable')

  if (sslMode === 'disable') {
    return false
  }

  return {
    rejectUnauthorized: sslMode === 'verify-full',
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSslConfig(),
})

app.use(cors())
app.use(express.json({ limit: '1mb' }))

function sendError(res, status, code, message, details) {
  return res.status(status).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  })
}

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))
      return sendError(res, 400, 'VALIDATION_ERROR', 'Request validation failed', details)
    }

    req[source] = result.data
    return next()
  }
}

const queryAddressSchema = z.object({
  address: z.string().regex(ADDRESS_REGEX, 'Invalid wallet address'),
})

const applicationSchema = z.object({
  borrower_address: z.string().regex(ADDRESS_REGEX, 'Invalid borrower address'),
  borrower_name: z.string().min(2).max(255),
  email: z.string().email(),
  business_type: z.string().min(2).max(255),
  loan_amount: z.coerce.number().positive(),
  loan_purpose: z.string().min(3).max(2000),
  business_description: z.string().min(10).max(5000),
})

const investmentSchema = z.object({
  loan_id: z.string().uuid(),
  lender_address: z.string().regex(ADDRESS_REGEX, 'Invalid lender address'),
  amount: z.coerce.number().positive(),
  interest_rate: z.coerce.number().min(0).max(100),
})

const profileSchema = z.object({
  wallet_address: z.string().regex(ADDRESS_REGEX, 'Invalid wallet address'),
  full_name: z.string().min(2).max(255),
  email: z.string().email(),
})

// Basic API health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Get all active loans
app.get('/api/loans', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM loans WHERE status = $1 ORDER BY created_at DESC',
      ['active']
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    sendError(res, 500, 'DATABASE_ERROR', 'Failed to fetch loans')
  }
})

// Get loan by ID
app.get('/api/loans/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loans WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return sendError(res, 404, 'NOT_FOUND', 'Loan not found')
    }
    return res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to fetch loan')
  }
})

// Submit loan application
app.post('/api/applications', validate(applicationSchema), async (req, res) => {
  const { borrower_address, borrower_name, email, business_type, loan_amount, loan_purpose, business_description } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO loan_applications
       (borrower_address, borrower_name, email, business_type, loan_amount, loan_purpose, business_description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [borrower_address, borrower_name, email, business_type, loan_amount, loan_purpose, business_description]
    )
    return res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to submit application')
  }
})

// Get applications by address
app.get('/api/applications', validate(queryAddressSchema, 'query'), async (req, res) => {
  const { address } = req.query

  try {
    const result = await pool.query(
      'SELECT * FROM loan_applications WHERE borrower_address = $1 ORDER BY created_at DESC',
      [address]
    )
    return res.json(result.rows)
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to fetch applications')
  }
})

// Create investment
app.post('/api/investments', validate(investmentSchema), async (req, res) => {
  const { loan_id, lender_address, amount, interest_rate } = req.body

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const loanResult = await client.query('SELECT * FROM loans WHERE id = $1 FOR UPDATE', [loan_id])
    if (loanResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return sendError(res, 404, 'NOT_FOUND', 'Loan not found')
    }

    const loan = loanResult.rows[0]
    const expectedReturn = Number(amount) * (1 + Number(interest_rate) / 100)

    const investmentResult = await client.query(
      `INSERT INTO investments (loan_id, lender_address, amount, interest_rate, expected_return, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [loan_id, lender_address, amount, interest_rate, expectedReturn]
    )

    const newFundedAmount = parseFloat(loan.funded_amount) + parseFloat(amount)
    const newFundedPercentage = Math.round((newFundedAmount / parseFloat(loan.loan_amount)) * 100)
    const newStatus = newFundedPercentage >= 100 ? 'funded' : 'active'

    await client.query(
      'UPDATE loans SET funded_amount = $1, funded_percentage = $2, status = $3, updated_at = NOW() WHERE id = $4',
      [newFundedAmount, newFundedPercentage, newStatus, loan_id]
    )

    await client.query('COMMIT')
    return res.json(investmentResult.rows[0])
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to create investment')
  } finally {
    client.release()
  }
})

// Get investments by address
app.get('/api/investments', validate(queryAddressSchema, 'query'), async (req, res) => {
  const { address } = req.query

  try {
    const result = await pool.query(
      'SELECT * FROM investments WHERE lender_address = $1 ORDER BY created_at DESC',
      [address]
    )
    return res.json(result.rows)
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to fetch investments')
  }
})

// Get user profile
app.get('/api/profile/:address', async (req, res) => {
  if (!ADDRESS_REGEX.test(req.params.address)) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid wallet address')
  }

  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE wallet_address = $1',
      [req.params.address]
    )
    if (result.rows.length === 0) {
      return sendError(res, 404, 'NOT_FOUND', 'Profile not found')
    }
    return res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to fetch profile')
  }
})

// Create or update profile
app.post('/api/profile', validate(profileSchema), async (req, res) => {
  const { wallet_address, full_name, email } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO profiles (wallet_address, full_name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (wallet_address) DO UPDATE SET full_name = $2, email = $3, updated_at = NOW()
       RETURNING *`,
      [wallet_address, full_name, email]
    )
    return res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to upsert profile')
  }
})

const PORT = process.env.PORT || 3001

// Quiz progress endpoints
const quizProgressSchema = z.object({
  wallet_address: z.string().regex(ADDRESS_REGEX),
  module_id: z.string().min(1),
  score: z.number().min(0).max(100),
  completed: z.boolean(),
})

// Save quiz progress
app.post('/api/quiz-progress', validate(quizProgressSchema), async (req, res) => {
  const { wallet_address, module_id, score, completed } = req.body

  try {
    const result = await pool.query(
      `INSERT INTO quiz_progress (wallet_address, module_id, score, completed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (wallet_address, module_id) DO UPDATE SET score = $3, completed = $4, updated_at = NOW()
       RETURNING *`,
      [wallet_address, module_id, score, completed]
    )
    return res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to save quiz progress')
  }
})

// Get quiz progress for a user
app.get('/api/quiz-progress', validate(queryAddressSchema, 'query'), async (req, res) => {
  const { address } = req.query

  try {
    const result = await pool.query(
      'SELECT * FROM quiz_progress WHERE wallet_address = $1 ORDER BY updated_at DESC',
      [address]
    )
    return res.json(result.rows)
  } catch (err) {
    console.error(err)
    return sendError(res, 500, 'DATABASE_ERROR', 'Failed to fetch quiz progress')
  }
})

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
