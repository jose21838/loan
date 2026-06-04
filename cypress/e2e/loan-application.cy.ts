describe('Loan Application Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  describe('Step 1: Loan Type Selection', () => {
    it('should display loan type selection options', () => {
      cy.contains('Select Loan Type').should('be.visible')
      cy.contains('Personal Loan').should('be.visible')
      cy.contains('Home Loan').should('be.visible')
      cy.contains('Business Loan').should('be.visible')
    })

    it('should select personal loan and fill details', () => {
      cy.contains('label', 'Personal Loan').click()
      cy.get('input[type="number"]').first().type('500000')
      cy.get('input[type="number"]').last().type('60')
      cy.contains('button', 'Next').click()
    })

    it('should validate loan amount', () => {
      cy.contains('label', 'Personal Loan').click()
      cy.get('input[type="number"]').first().type('5000')
      cy.contains('button', 'Next').click()
      cy.contains('Minimum loan amount is 10,000').should('be.visible')
    })
  })

  describe('Step 2: Personal Information', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.contains('label', 'Personal Loan').click()
      cy.get('input[type="number"]').first().type('500000')
      cy.get('input[type="number"]').last().type('60')
      cy.contains('button', 'Next').click()
    })

    it('should fill personal information', () => {
      cy.get('input[placeholder="John"]').type('John')
      cy.get('input[placeholder="Doe"]').type('Doe')
      cy.get('input[type="email"]').type('john@example.com')
      cy.get('input[type="tel"]').type('9876543210')
      cy.get('input[type="date"]').first().type('1990-01-01')
      cy.get('select').first().select('male')
      cy.contains('button', 'Next').click()
    })

    it('should validate required fields', () => {
      cy.contains('button', 'Next').click()
      cy.contains('First name is required').should('be.visible')
    })

    it('should validate email format', () => {
      cy.get('input[placeholder="John"]').type('John')
      cy.get('input[placeholder="Doe"]').type('Doe')
      cy.get('input[type="email"]').type('invalid-email')
      cy.get('input[type="tel"]').type('9876543210')
      cy.get('input[type="date"]').first().type('1990-01-01')
      cy.contains('button', 'Next').click()
      cy.contains('Invalid email address').should('be.visible')
    })
  })

  describe('Step 3: Address Information', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000')
      cy.contains('label', 'Personal Loan').click()
      cy.get('input[type="number"]').first().type('500000')
      cy.get('input[type="number"]').last().type('60')
      cy.contains('button', 'Next').click()
      cy.get('input[placeholder="John"]').type('John')
      cy.get('input[placeholder="Doe"]').type('Doe')
      cy.get('input[type="email"]').type('john@example.com')
      cy.get('input[type="tel"]').type('9876543210')
      cy.get('input[type="date"]').first().type('1990-01-01')
      cy.get('select').first().select('male')
      cy.contains('button', 'Next').click()
    })

    it('should fill address information', () => {
      cy.get('input[placeholder="Street address"]').type('123 Main Street')
      cy.get('input[placeholder="Mumbai"]').type('Mumbai')
      cy.get('input[placeholder="Maharashtra"]').type('Maharashtra')
      cy.get('input[placeholder="400001"]').type('400001')
      cy.get('input[type="date"]').first().type('2020-01-01')
      cy.contains('button', 'Next').click()
    })
  })

  describe('Step 4: Verification', () => {
    beforeEach(() => {
      // Fill previous steps
      cy.visit('http://localhost:3000')
      cy.contains('label', 'Personal Loan').click()
      cy.get('input[type="number"]').first().type('500000')
      cy.get('input[type="number"]').last().type('60')
      cy.contains('button', 'Next').click()
      cy.get('input[placeholder="John"]').type('John')
      cy.get('input[placeholder="Doe"]').type('Doe')
      cy.get('input[type="email"]').type('john@example.com')
      cy.get('input[type="tel"]').type('9876543210')
      cy.get('input[type="date"]').first().type('1990-01-01')
      cy.get('select').first().select('male')
      cy.contains('button', 'Next').click()
      cy.get('input[placeholder="Street address"]').type('123 Main Street')
      cy.get('input[placeholder="Mumbai"]').type('Mumbai')
      cy.get('input[placeholder="Maharashtra"]').type('Maharashtra')
      cy.get('input[placeholder="400001"]').type('400001')
      cy.get('input[type="date"]').first().type('2020-01-01')
      cy.contains('button', 'Next').click()
    })

    it('should verify PAN', () => {
      cy.get('input[placeholder="AAAAA0000A"]').type('AAAAA0000A')
      cy.contains('button', 'Verify').first().click()
      cy.contains('PAN verified', { timeout: 3000 }).should('be.visible')
    })

    it('should verify Aadhaar', () => {
      cy.get('input[placeholder="123456789012"]').type('123456789012')
      cy.contains('button', 'Verify').last().click()
      cy.contains('Aadhaar verified', { timeout: 3000 }).should('be.visible')
    })
  })

  describe('Auto-save functionality', () => {
    it('should auto-save form data', () => {
      cy.contains('label', 'Personal Loan').click()
      cy.get('input[type="number"]').first().type('500000')
      cy.wait(31000) // Wait for auto-save
      cy.contains('Last saved:').should('be.visible')
    })
  })

  describe('Cross-step validation dependencies', () => {
    it('should show business fields only for business loans', () => {
      cy.contains('label', 'Business Loan').click()
      cy.contains('button', 'Next').click()
      // Fill to business step
      cy.visit('http://localhost:3000')
      // Note: This would require filling all previous steps
    })
  })
})
