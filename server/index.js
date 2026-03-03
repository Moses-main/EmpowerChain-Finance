import express from 'express'
import pg from 'pg'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
})

app.use(cors())
app.use(express.json())

// Get all active loans
app.get('/api/loans', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM loans WHERE status = $1 ORDER BY created_at DESC',
      ['active']
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Get loan by ID
app.get('/api/loans/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loans WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Submit loan application
app.post('/api/applications', async (req, res) => {
  const { borrower_address, borrower_name, email, business_type, loan_amount, loan_purpose, business_description } = req.body
  
  try {
    const result = await pool.query(
      `INSERT INTO loan_applications 
       (borrower_address, borrower_name, email, business_type, loan_amount, loan_purpose, business_description, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') 
       RETURNING *`,
      [borrower_address, borrower_name, email, business_type, loan_amount, loan_purpose, business_description]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Get applications by address
app.get('/api/applications', async (req, res) => {
  const { address } = req.query
  
  try {
    const result = await pool.query(
      'SELECT * FROM loan_applications WHERE borrower_address = $1 ORDER BY created_at DESC',
      [address]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Create investment
app.post('/api/investments', async (req, res) => {
  const { loan_id, lender_address, amount, interest_rate } = req.body
  
  try {
    const loanResult = await pool.query('SELECT * FROM loans WHERE id = $1', [loan_id])
    if (loanResult.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' })
    }
    
    const loan = loanResult.rows[0]
    const expected_return = amount * (1 + interest_rate / 100)
    
    const investmentResult = await pool.query(
      `INSERT INTO investments (loan_id, lender_address, amount, interest_rate, expected_return, status) 
       VALUES ($1, $2, $3, $4, $5, 'active') 
       RETURNING *`,
      [loan_id, lender_address, amount, interest_rate, expected_return]
    )
    
    const newFundedAmount = parseFloat(loan.funded_amount) + parseFloat(amount)
    const newFundedPercentage = Math.round((newFundedAmount / parseFloat(loan.loan_amount)) * 100)
    const newStatus = newFundedPercentage >= 100 ? 'funded' : 'active'
    
    await pool.query(
      'UPDATE loans SET funded_amount = $1, funded_percentage = $2, status = $3 WHERE id = $4',
      [newFundedAmount, newFundedPercentage, newStatus, loan_id]
    )
    
    res.json(investmentResult.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Get investments by address
app.get('/api/investments', async (req, res) => {
  const { address } = req.query
  
  try {
    const result = await pool.query(
      'SELECT * FROM investments WHERE lender_address = $1 ORDER BY created_at DESC',
      [address]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Get user profile
app.get('/api/profile/:address', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE wallet_address = $1',
      [req.params.address]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Create or update profile
app.post('/api/profile', async (req, res) => {
  const { wallet_address, full_name, email } = req.body
  
  try {
    const result = await pool.query(
      `INSERT INTO profiles (wallet_address, full_name, email) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (wallet_address) DO UPDATE SET full_name = $2, email = $3, updated_at = NOW()
       RETURNING *`,
      [wallet_address, full_name, email]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
