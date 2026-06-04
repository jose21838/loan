import axios, { AxiosInstance } from 'axios'
import type { PreApprovalSummary, LoanApplicationData } from '../types'

class LoanApplicationAPI {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // PAN Verification
  async verifyPAN(panNumber: string): Promise<{ verified: boolean; name?: string; error?: string }> {
    try {
      // Simulation of PAN verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)
      if (isValid) {
        return {
          verified: true,
          name: `Verified PAN: ${panNumber}`,
        }
      }
      return {
        verified: false,
        error: 'Invalid PAN format',
      }
    } catch (error) {
      return {
        verified: false,
        error: 'Verification failed',
      }
    }
  }

  // Aadhaar Verification
  async verifyAadhaar(aadhaarNumber: string): Promise<{ verified: boolean; name?: string; error?: string }> {
    try {
      // Simulation of Aadhaar verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const isValid = /^\d{12}$/.test(aadhaarNumber)
      if (isValid) {
        return {
          verified: true,
          name: `Verified Aadhaar: ${aadhaarNumber.slice(-4)}`,
        }
      }
      return {
        verified: false,
        error: 'Invalid Aadhaar format',
      }
    } catch (error) {
      return {
        verified: false,
        error: 'Verification failed',
      }
    }
  }

  // Address Autocomplete
  async getAddressSuggestions(query: string): Promise<string[]> {
    try {
      // Simulation of address autocomplete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const suggestions = [
        `${query}, Mumbai, Maharashtra 400001`,
        `${query}, Bangalore, Karnataka 560001`,
        `${query}, Delhi 110001`,
        `${query}, Hyderabad, Telangana 500001`,
      ]
      return suggestions
    } catch (error) {
      return []
    }
  }

  // Generate Pre-Approval
  async generatePreApproval(applicationData: Partial<LoanApplicationData>): Promise<PreApprovalSummary> {
    try {
      // Simulation of pre-approval generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      const loanAmount = applicationData.loanAmount || 0
      const tenor = applicationData.loanTenure || 12
      const rateOfInterest = applicationData.loanType === 'personal' ? 10.5 : 
                            applicationData.loanType === 'home' ? 7.2 : 12.5

      // Simple EMI calculation: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
      const monthlyRate = rateOfInterest / 100 / 12
      const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenor)
      const denominator = Math.pow(1 + monthlyRate, tenor) - 1
      const estimatedEmi = numerator / denominator

      // Determine eligibility
      const monthlyIncome = applicationData.monthlyIncome || 30000
      const maxLoanAmount = monthlyIncome * tenor * 0.5 // Simplified eligibility
      const eligible = loanAmount <= maxLoanAmount

      return {
        loanAmount,
        eligibleAmount: Math.round(maxLoanAmount),
        estimatedEmi: Math.round(estimatedEmi),
        rateOfInterest,
        tenor,
        status: eligible ? 'approved' : 'pending_review',
        conditions: [
          'Income verification required',
          'Employment letter required',
          'Bank statements for last 6 months',
        ],
        nextSteps: [
          'Document verification',
          'Loan agreement signing',
          'Fund disbursement',
        ],
      }
    } catch (error) {
      throw new Error('Failed to generate pre-approval')
    }
  }

  // Submit Application
  async submitApplication(applicationData: Partial<LoanApplicationData>): Promise<{ success: boolean; applicationId: string; message: string }> {
    try {
      // Simulation of application submission
      await new Promise(resolve => setTimeout(resolve, 1500))

      const applicationId = `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      return {
        success: true,
        applicationId,
        message: 'Application submitted successfully',
      }
    } catch (error) {
      return {
        success: false,
        applicationId: '',
        message: 'Failed to submit application',
      }
    }
  }

  // Upload Document
  async uploadDocument(file: File, documentType: string): Promise<{ fileUrl: string; success: boolean }> {
    try {
      // Simulation of file upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const fileUrl = URL.createObjectURL(file)
      return {
        fileUrl,
        success: true,
      }
    } catch (error) {
      return {
        fileUrl: '',
        success: false,
      }
    }
  }
}

export const loanAPI = new LoanApplicationAPI()
