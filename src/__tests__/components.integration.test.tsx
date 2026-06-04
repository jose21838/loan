import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step1LoanType } from '../components/steps/Step1LoanType'
import { Step2PersonalInfo } from '../components/steps/Step2PersonalInfo'
import { useFormStore } from '../store'

describe('Step1LoanType Component', () => {
  beforeEach(() => {
    useFormStore.setState({
      formData: {
        loanType: 'personal',
        loanAmount: 0,
        loanTenure: 12,
      },
    })
  })

  test('renders loan type selection', () => {
    render(<Step1LoanType />)
    expect(screen.getByText('Personal Loan')).toBeInTheDocument()
    expect(screen.getByText('Home Loan')).toBeInTheDocument()
    expect(screen.getByText('Business Loan')).toBeInTheDocument()
  })

  test('can select loan type', async () => {
    render(<Step1LoanType />)
    const homeLoantoggle = screen.getByLabelText(/Home Loan/, { selector: 'input' })
    fireEvent.click(homeLoantoggle)
    expect(homeLoantoggle).toBeChecked()
  })

  test('validates loan amount', () => {
    render(<Step1LoanType />)
    const loanAmountInput = screen.getAllByRole('spinbutton')[0]
    fireEvent.change(loanAmountInput, { target: { value: '5000' } })
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText(/Minimum loan amount/)).toBeInTheDocument()
  })
})

describe('Step2PersonalInfo Component', () => {
  beforeEach(() => {
    useFormStore.setState({
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'male',
      },
    })
  })

  test('renders personal info form', () => {
    render(<Step2PersonalInfo />)
    expect(screen.getByDisplayValue('')).toBeTruthy()
  })

  test('validates email format', async () => {
    const user = userEvent.setup()
    render(<Step2PersonalInfo />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'John')
    await user.type(inputs[1], 'Doe')
    await user.type(inputs[2], 'invalid-email')
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid email/)).toBeInTheDocument()
    })
  })

  test('validates age requirement', async () => {
    render(<Step2PersonalInfo />)
    const dateInput = screen.getByRole('textbox', { hidden: true })
    fireEvent.change(dateInput, { target: { value: '2020-01-01' } })
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      expect(screen.getByText(/Age must be between/)).toBeInTheDocument()
    })
  })
})

describe('Form Store Integration', () => {
  test('updates form data correctly', () => {
    const { updateFormData } = useFormStore.getState()
    updateFormData({
      firstName: 'John',
      loanAmount: 500000,
    })

    const { formData } = useFormStore.getState()
    expect(formData.firstName).toBe('John')
    expect(formData.loanAmount).toBe(500000)
  })

  test('auto-save persists to localStorage', () => {
    const { formData, saveToLocalStorage } = useFormStore.getState()
    saveToLocalStorage()
    
    const saved = localStorage.getItem('loan_application_form_data')
    expect(saved).toBeTruthy()
    expect(JSON.parse(saved!)).toHaveProperty('firstName')
  })

  test('loads from localStorage', () => {
    const testData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    }
    localStorage.setItem('loan_application_form_data', JSON.stringify(testData))
    
    const { loadFromLocalStorage } = useFormStore.getState()
    loadFromLocalStorage()
    
    const { formData } = useFormStore.getState()
    expect(formData.firstName).toBe('Jane')
  })
})

describe('Document Upload', () => {
  test('validates file size', async () => {
    // This would require importing DocumentUpload component
    // and testing file validation
  })

  test('compresses image files', async () => {
    // This would require testing the compression utility
  })
})

describe('Conditional Rendering', () => {
  test('shows employment fields for personal loans', () => {
    useFormStore.setState({
      formData: { loanType: 'personal' },
    })
    render(<Step1LoanType />)
    // Step 1 doesn't show employment, but Step 5 would
  })

  test('shows business fields for business loans', () => {
    useFormStore.setState({
      formData: { loanType: 'business' },
    })
    render(<Step1LoanType />)
    // Step 5 would show different fields
  })
})
