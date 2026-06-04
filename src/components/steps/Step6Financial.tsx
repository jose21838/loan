import React, { useState } from 'react'
import { useFormStore } from '../../store'
import { FormStep } from '../FormStep'
import { financialSchema } from '../../types/schemas'

export const Step6Financial: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loanCount, setLoanCount] = useState(formData.existingLoans?.length || 0)

  const handleValidation = () => {
    try {
      const data = {
        savingsAccount: formData.savingsAccount || '',
        savingsBalance: formData.savingsBalance || 0,
      }
      financialSchema.parse(data)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
      setErrors(newErrors)
      return false
    }
  }

  const addLoan = () => {
    const loans = formData.existingLoans || []
    loans.push({ type: '', balance: 0, emi: 0 })
    updateFormData({ existingLoans: loans })
    setLoanCount(loans.length)
  }

  const removeLoan = (index: number) => {
    const loans = (formData.existingLoans || []).filter((_, i) => i !== index)
    updateFormData({ existingLoans: loans })
    setLoanCount(loans.length)
  }

  const updateLoan = (index: number, field: 'type' | 'balance' | 'emi', value: string | number) => {
    const loans = [...(formData.existingLoans || [])]
    loans[index] = { ...loans[index], [field]: value }
    updateFormData({ existingLoans: loans })
  }

  return (
    <FormStep
      stepNumber={6}
      title="Financial Information"
      description="Enter your financial details and existing loans"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      <div className="space-y-6">
        {/* Savings Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Savings Account Number *
          </label>
          <input
            type="text"
            value={formData.savingsAccount || ''}
            onChange={(e) => updateFormData({ savingsAccount: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.savingsAccount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Account number"
          />
          {errors.savingsAccount && <p className="form-error">{errors.savingsAccount}</p>}
        </div>

        {/* Savings Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Savings Balance (₹) *
          </label>
          <input
            type="number"
            value={formData.savingsBalance || ''}
            onChange={(e) => updateFormData({ savingsBalance: parseInt(e.target.value) || 0 })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.savingsBalance ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            placeholder="Balance amount"
          />
          {errors.savingsBalance && <p className="form-error">{errors.savingsBalance}</p>}
        </div>

        {/* Existing Loans */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Existing Loans
            </label>
            <button
              onClick={addLoan}
              className="px-3 py-1 text-sm bg-primary-100 text-primary-600 rounded hover:bg-primary-200"
            >
              + Add Loan
            </button>
          </div>

          {(formData.existingLoans || []).map((loan, index: number) => (
            <div key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg mb-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-700">Loan {index + 1}</h4>
                <button
                  onClick={() => removeLoan(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Loan Type
                  </label>
                  <input
                    type="text"
                    value={loan.type}
                    onChange={(e) => updateLoan(index, 'type', e.target.value)}
                    placeholder="E.g., Car Loan"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Outstanding Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={loan.balance}
                    onChange={(e) => updateLoan(index, 'balance', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Monthly EMI (₹)
                  </label>
                  <input
                    type="number"
                    value={loan.emi}
                    onChange={(e) => updateLoan(index, 'emi', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {loanCount === 0 && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              No existing loans. Click "Add Loan" if you have any.
            </p>
          )}
        </div>

        {/* Credit Score (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Score (Optional)
          </label>
          <input
            type="number"
            value={formData.creditScore || ''}
            onChange={(e) => updateFormData({ creditScore: parseInt(e.target.value) || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none"
            min="300"
            max="900"
            placeholder="300-900"
          />
        </div>
      </div>
    </FormStep>
  )
}
