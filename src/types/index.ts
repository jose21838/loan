export type LoanType = 'personal' | 'home' | 'business'

export type DocumentType = 'identity' | 'address_proof' | 'income' | 'property' | 'business_registration' | 'gst_certificate'

export interface LoanApplicationData {
  // Step 1: Loan Type Selection
  loanType: LoanType
  loanAmount: number
  loanTenure: number
  purpose?: string

  // Step 2: Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  gender: 'male' | 'female' | 'other'

  // Step 3: Address Information
  currentAddress: string
  currentCity: string
  currentState: string
  currentPincode: string
  currentCountry: string
  residenceSince: string
  permanentAddress?: string
  isSameAsCurrent: boolean

  // Step 4: Verification
  panNumber: string
  aadhaarNumber: string
  panVerified: boolean
  aadhaarVerified: boolean
  panVerificationStatus?: 'pending' | 'verified' | 'failed'
  aadhaarVerificationStatus?: 'pending' | 'verified' | 'failed'

  // Step 5: Employment/Business Information
  employmentType?: string
  companyName?: string
  designation?: string
  yearsOfExperience?: number
  monthlyIncome?: number
  businessType?: string
  businessRegistrationNumber?: string
  businessAge?: number
  annualTurnover?: number

  // Step 6: Financial Information
  savingsAccount: string
  savingsBalance: number
  existingLoans: Array<{
    type: string
    balance: number
    emi: number
  }>
  creditScore?: number

  // Step 7: Document Upload
  documents: Array<{
    type: DocumentType
    fileUrl: string
    fileName: string
    uploadedAt: string
    verified: boolean
  }>

  // Step 8: E-Signature
  signatureData?: string
  signatureCapturedAt?: string

  // Step 9: Consent & Declaration
  termsAgreed: boolean
  privacyAgreed: boolean
  dataConsent: boolean

  // Metadata
  createdAt: string
  updatedAt: string
  autoSavedAt?: string
  submittedAt?: string
  preApprovalStatus?: 'pending' | 'approved' | 'rejected'
  preApprovalSummary?: PreApprovalSummary
}

export interface PreApprovalSummary {
  loanAmount: number
  eligibleAmount: number
  estimatedEmi: number
  rateOfInterest: number
  tenor: number
  status: 'approved' | 'rejected' | 'pending_review'
  reason?: string
  conditions?: string[]
  nextSteps: string[]
}

export interface FormErrors {
  [key: string]: string
}

export interface StepValidationResult {
  isValid: boolean
  errors: FormErrors
}

export interface AutoSaveState {
  lastSavedAt: string | null
  isDirty: boolean
  isAutoSaving: boolean
}

export interface ESignatureData {
  imageData: string
  timestamp: string
  ipAddress?: string
}

export type ValidationRule = {
  required?: string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: (value: any) => string | true
}
