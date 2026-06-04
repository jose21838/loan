import React, { useState } from 'react'
import { useFormStore } from '../../store'
import { FormStep } from '../FormStep'
import { employmentSchema, businessSchema } from '../../types/schemas'

export const Step5Employment: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleValidation = () => {
    try {
      if (formData.loanType === 'personal' || formData.loanType === 'home') {
        const data = {
          employmentType: formData.employmentType || '',
          companyName: formData.companyName || '',
          designation: formData.designation || '',
          yearsOfExperience: formData.yearsOfExperience || 0,
          monthlyIncome: formData.monthlyIncome || 0,
        }
        employmentSchema.parse(data)
      } else if (formData.loanType === 'business') {
        const data = {
          businessType: formData.businessType || '',
          businessRegistrationNumber: formData.businessRegistrationNumber || '',
          businessAge: formData.businessAge || 0,
          annualTurnover: formData.annualTurnover || 0,
        }
        businessSchema.parse(data)
      }
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

  if (formData.loanType === 'business') {
    return (
      <FormStep
        stepNumber={5}
        title="Business Information"
        description="Provide your business details"
        onNext={handleValidation}
        onPrev={() => {}}
      >
        <div className="space-y-6">
          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              value={formData.businessType || ''}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.businessType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select business type</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="private_ltd">Private Limited</option>
              <option value="public_ltd">Public Limited</option>
              <option value="llp">LLP</option>
            </select>
            {errors.businessType && <p className="form-error">{errors.businessType}</p>}
          </div>

          {/* Business Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Registration Number *
            </label>
            <input
              type="text"
              value={formData.businessRegistrationNumber || ''}
              onChange={(e) => updateFormData({ businessRegistrationNumber: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.businessRegistrationNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="CIN/LLC Number"
            />
            {errors.businessRegistrationNumber && (
              <p className="form-error">{errors.businessRegistrationNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Age (Years) *
              </label>
              <input
                type="number"
                value={formData.businessAge || ''}
                onChange={(e) => updateFormData({ businessAge: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                  errors.businessAge ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                placeholder="2"
              />
              {errors.businessAge && <p className="form-error">{errors.businessAge}</p>}
            </div>

            {/* Annual Turnover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Turnover (₹) *
              </label>
              <input
                type="number"
                value={formData.annualTurnover || ''}
                onChange={(e) => updateFormData({ annualTurnover: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                  errors.annualTurnover ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                placeholder="5000000"
              />
              {errors.annualTurnover && <p className="form-error">{errors.annualTurnover}</p>}
            </div>
          </div>
        </div>
      </FormStep>
    )
  }

  return (
    <FormStep
      stepNumber={5}
      title="Employment Information"
      description="Provide your employment details"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      <div className="space-y-6">
        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            value={formData.employmentType || ''}
            onChange={(e) => updateFormData({ employmentType: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.employmentType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select employment type</option>
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self Employed</option>
            <option value="retired">Retired</option>
          </select>
          {errors.employmentType && <p className="form-error">{errors.employmentType}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.companyName || ''}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your Company Name"
          />
          {errors.companyName && <p className="form-error">{errors.companyName}</p>}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation *
          </label>
          <input
            type="text"
            value={formData.designation || ''}
            onChange={(e) => updateFormData({ designation: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.designation ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your Job Title"
          />
          {errors.designation && <p className="form-error">{errors.designation}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience *
            </label>
            <input
              type="number"
              value={formData.yearsOfExperience || ''}
              onChange={(e) => updateFormData({ yearsOfExperience: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              placeholder="5"
            />
            {errors.yearsOfExperience && <p className="form-error">{errors.yearsOfExperience}</p>}
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (₹) *
            </label>
            <input
              type="number"
              value={formData.monthlyIncome || ''}
              onChange={(e) => updateFormData({ monthlyIncome: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              placeholder="50000"
            />
            {errors.monthlyIncome && <p className="form-error">{errors.monthlyIncome}</p>}
          </div>
        </div>
      </div>
    </FormStep>
  )
}
