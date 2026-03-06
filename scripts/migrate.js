import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: '',
    cert: '',
    key: ''
  }
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running database migrations...');
    
    // Enable UUID extension
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    console.log('✅ UUID extension enabled');

    // Create profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        wallet_address VARCHAR(66) UNIQUE,
        full_name VARCHAR(255),
        email VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ profiles table created');

    // Create loan_applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS loan_applications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        borrower_address VARCHAR(66) NOT NULL,
        borrower_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        business_type VARCHAR(255) NOT NULL,
        loan_amount DECIMAL(18, 2) NOT NULL,
        loan_purpose TEXT,
        business_description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected', 'funded', 'repaid', 'defaulted'))
      );
    `);
    console.log('✅ loan_applications table created');

    // Create loans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        borrower_address VARCHAR(66) NOT NULL,
        borrower_name VARCHAR(255) NOT NULL,
        business_type VARCHAR(255) NOT NULL,
        loan_amount DECIMAL(18, 2) NOT NULL,
        interest_rate DECIMAL(5, 2) NOT NULL,
        description TEXT,
        funded_amount DECIMAL(18, 2) DEFAULT 0,
        funded_percentage INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT loan_status_check CHECK (status IN ('active', 'funded', 'repaid', 'defaulted'))
      );
    `);
    console.log('✅ loans table created');

    // Create investments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
        lender_address VARCHAR(66) NOT NULL,
        amount DECIMAL(18, 2) NOT NULL,
        interest_rate DECIMAL(5, 2) NOT NULL,
        expected_return DECIMAL(18, 2),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT investment_status_check CHECK (status IN ('active', 'repaid', 'defaulted'))
      );
    `);
    console.log('✅ investments table created');

    // Create completed_modules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS completed_modules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_address VARCHAR(66) NOT NULL,
        module_id VARCHAR(100) NOT NULL,
        score INTEGER NOT NULL,
        nft_badge VARCHAR(10),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_address, module_id)
      );
    `);
    console.log('✅ completed_modules table created');

    // Create quiz_progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_progress (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        wallet_address VARCHAR(66) NOT NULL,
        module_id VARCHAR(100) NOT NULL,
        score INTEGER NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(wallet_address, module_id)
      );
    `);
    console.log('✅ quiz_progress table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
      CREATE INDEX IF NOT EXISTS idx_loan_applications_borrower ON loan_applications(borrower_address);
      CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
      CREATE INDEX IF NOT EXISTS idx_investments_loan ON investments(loan_id);
      CREATE INDEX IF NOT EXISTS idx_investments_lender ON investments(lender_address);
      CREATE INDEX IF NOT EXISTS idx_completed_modules_user ON completed_modules(user_address);
    `);
    console.log('✅ Indexes created');

    // Insert sample loans for demo
    const existingLoans = await client.query('SELECT COUNT(*) FROM loans');
    if (parseInt(existingLoans.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO loans (borrower_address, borrower_name, business_type, loan_amount, interest_rate, description, funded_amount, funded_percentage, status)
        VALUES 
          ('0x742d35Cc6634C0532925a3b844Bc9e7595f12eB1', 'Amara Okafor', 'Textile Manufacturing', 5000, 8, 'Expanding textile production with new equipment', 3750, 75, 'active'),
          ('0x8Ba1f109551bD432803012645Hac136E765C6d61', 'Carlos Mendez', 'Agricultural Cooperative', 3500, 7, 'Modernizing farming techniques', 3220, 92, 'active'),
          ('0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Fatima Hassan', 'Digital Services', 2000, 6, 'Building a tech consulting firm', 900, 45, 'active'),
          ('0x14dC79964da2C08b23698B3D3cc7Ca32193d9955', 'Raj Patel', 'Food & Beverage', 7500, 9, 'Opening a new restaurant location', 1500, 20, 'active'),
          ('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', 'Maria Garcia', 'Healthcare', 4500, 7, 'Medical supplies for clinic expansion', 3600, 80, 'active');
      `);
      console.log('✅ Sample loans inserted');
    } else {
      console.log('ℹ️  Loans already exist, skipping seed data');
    }

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
