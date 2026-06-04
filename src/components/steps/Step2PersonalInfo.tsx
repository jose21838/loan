import React, { useState } from 'react'
import { useFormStore } from '../../store'
import { FormStep } from '../FormStep'
import { personalInfoSchema } from '../../types/schemas'
import { calculateAge, validateAge } from '../../utils/formatting'

export const Step2PersonalInfo: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleValidation = () => {
    try {
      const data = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        dob: formData.dob || '',
        gender: formData.gender || 'male',
      }
      personalInfoSchema.parse(data)

      // Validate age
      if (!validateAge(formData.dob || '', 18, 65)) {
        setErrors({ dob: 'Age must be between 18 and 65 years' })
        return false
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

  const handlePrev = () => {}

  return (
    <FormStep
      stepNumber={2}
      title="Personal Information"
      description="Enter your personal details"
      onNext={handleValidation}
      onPrev={handlePrev}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="9876543210"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dob || ''}
            onChange={(e) => updateFormData({ dob: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.dob ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {formData.dob && (
            <p className="text-xs text-gray-600 mt-1">Age: {calculateAge(formData.dob)} years</p>
          )}
          {errors.dob && <p className="form-error">{errors.dob}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender || 'male'}
            onChange={(e) => updateFormData({ gender: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </FormStep>
  )
}
