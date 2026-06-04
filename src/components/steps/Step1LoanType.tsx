import React, { useState } from 'react'
import { useFormStore } from '../../store'
import { FormStep } from '../FormStep'
import { loanTypeSchema } from '../../types/schemas'
import type { LoanApplicationData } from '../../types'

export const Step1LoanType: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loanTypes = [
    {
      value: 'personal' as const,
      label: 'Personal Loan',
      description: 'For personal needs, medical emergencies, education, etc.',
      icon: '👤',
    },
    {
      value: 'home' as const,
      label: 'Home Loan',
      description: 'For purchasing or constructing a residential property',
      icon: '🏠',
    },
    {
      value: 'business' as const,
      label: 'Business Loan',
      description: 'For business expansion, working capital, etc.',
      icon: '🏢',
    },
  ]

  const handleValidation = () => {
    try {
      const data = {
        loanType: formData.loanType,
        loanAmount: formData.loanAmount || 0,
        loanTenure: formData.loanTenure || 12,
      }
      loanTypeSchema.parse(data)
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

  return (
    <FormStep
      stepNumber={1}
      title="Select Loan Type"
      description="Choose the type of loan that best fits your needs"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      {/* Loan Type Selection */}
      <div className="space-y-4 mb-6">
        {loanTypes.map((type) => (
          <label
            key={type.value}
            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.loanType === type.value
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="loanType"
              value={type.value}
              checked={formData.loanType === type.value}
              onChange={(e) => {
                updateFormData({ loanType: e.target.value as LoanApplicationData['loanType'] })
              }}
              className="mr-3 w-4 h-4"
            />
            <span className="text-lg font-semibold text-gray-900 ml-2">{type.icon} {type.label}</span>
            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
          </label>
        ))}
      </div>

      {/* Loan Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Amount (₹)
        </label>
        <input
          type="number"
          value={formData.loanAmount || ''}
          onChange={(e) => updateFormData({ loanAmount: parseInt(e.target.value) || 0 })}
          min="10000"
          step="10000"
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
            errors.loanAmount ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Minimum ₹10,000"
        />
        {errors.loanAmount && <p className="form-error">{errors.loanAmount}</p>}
      </div>

      {/* Loan Tenure */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Tenure (Months)
        </label>
        <input
          type="number"
          value={formData.loanTenure || ''}
          onChange={(e) => updateFormData({ loanTenure: parseInt(e.target.value) || 12 })}
          min="1"
          max="240"
          step="1"
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
            errors.loanTenure ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="1-240 months"
        />
        {errors.loanTenure && <p className="form-error">{errors.loanTenure}</p>}
      </div>

      {/* Purpose (Conditional for Personal Loan) */}
      {formData.loanType === 'personal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Loan
          </label>
          <select
            value={formData.purpose || ''}
            onChange={(e) => updateFormData({ purpose: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">Select a purpose</option>
            <option value="medical">Medical Emergency</option>
            <option value="education">Education</option>
            <option value="travel">Travel</option>
            <option value="home_improvement">Home Improvement</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
    </FormStep>
  )
}
