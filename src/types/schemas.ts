import { z } from 'zod'

const phoneRegex = /^[0-9]{10}$/
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
const aadhaarRegex = /^[0-9]{12}$/
const pincodeRegex = /^[0-9]{6}$/

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Phone number must be 10 digits'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
})

// Address Schema
export const addressSchema = z.object({
  currentAddress: z.string().min(10, 'Address must be at least 10 characters'),
  currentCity: z.string().min(1, 'City is required'),
  currentState: z.string().min(1, 'State is required'),
  currentPincode: z.string().regex(pincodeRegex, 'Pincode must be 6 digits'),
  currentCountry: z.string().default('India'),
  residenceSince: z.string().min(1, 'Residence since date is required'),
  permanentAddress: z.string().optional(),
  isSameAsCurrent: z.boolean(),
})

// Verification Schema
export const verificationSchema = z.object({
  panNumber: z.string().regex(panRegex, 'Invalid PAN format'),
  aadhaarNumber: z.string().regex(aadhaarRegex, 'Aadhaar must be 12 digits'),
})

// Employment Schema (for Personal/Home loans)
export const employmentSchema = z.object({
  employmentType: z.string().min(1, 'Employment type is required'),
  companyName: z.string().min(1, 'Company name is required'),
  designation: z.string().min(1, 'Designation is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative'),
  monthlyIncome: z.number().min(0, 'Monthly income cannot be negative'),
})

// Business Schema (for Business loans)
export const businessSchema = z.object({
  businessType: z.string().min(1, 'Business type is required'),
  businessRegistrationNumber: z.string().min(1, 'Registration number is required'),
  businessAge: z.number().min(0, 'Business age cannot be negative'),
  annualTurnover: z.number().min(0, 'Annual turnover cannot be negative'),
})

// Loan Type Schema
export const loanTypeSchema = z.object({
  loanType: z.enum(['personal', 'home', 'business']),
  loanAmount: z.number().min(10000, 'Minimum loan amount is 10,000'),
  loanTenure: z.number().min(1, 'Tenure must be at least 1 month').max(240, 'Maximum tenure is 20 years'),
  purpose: z.string().optional(),
})

// Financial Information Schema
export const financialSchema = z.object({
  savingsAccount: z.string().min(1, 'Savings account number is required'),
  savingsBalance: z.number().min(0, 'Savings balance cannot be negative'),
})

// Full Application Schema
export const applicationSchema = z.object({
  loanType: z.enum(['personal', 'home', 'business']),
  loanAmount: z.number().min(10000),
  loanTenure: z.number().min(1).max(240),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex),
  dob: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  currentAddress: z.string().min(10),
  currentCity: z.string().min(1),
  currentState: z.string().min(1),
  currentPincode: z.string().regex(pincodeRegex),
  panNumber: z.string().regex(panRegex),
  aadhaarNumber: z.string().regex(aadhaarRegex),
  savingsAccount: z.string().min(1),
  savingsBalance: z.number().min(0),
  termsAgreed: z.boolean().refine(val => val === true, 'You must agree to terms'),
  privacyAgreed: z.boolean().refine(val => val === true, 'You must agree to privacy policy'),
  dataConsent: z.boolean().refine(val => val === true, 'You must provide data consent'),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type VerificationFormData = z.infer<typeof verificationSchema>
export type EmploymentFormData = z.infer<typeof employmentSchema>
export type BusinessFormData = z.infer<typeof businessSchema>
export type LoanTypeFormData = z.infer<typeof loanTypeSchema>
export type FinancialFormData = z.infer<typeof financialSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
