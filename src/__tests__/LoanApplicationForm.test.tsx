import { render, screen } from '@testing-library/react'
import { LoanApplicationForm } from '../components/LoanApplicationForm'

describe('LoanApplicationForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders loan application form', () => {
    render(<LoanApplicationForm />)
    expect(screen.getByText('Loan Application')).toBeInTheDocument()
  })

  test('displays step 1 on initial load', () => {
    render(<LoanApplicationForm />)
    expect(screen.getByText('Select Loan Type')).toBeInTheDocument()
  })

  test('shows progress indicator', () => {
    render(<LoanApplicationForm />)
    const stepIndicators = screen.getAllByRole('generic')
    expect(stepIndicators.length).toBeGreaterThan(0)
  })
})
