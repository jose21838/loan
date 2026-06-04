import React, { useState } from 'react'
import { useFormStore } from '../../store'
import { FormStep } from '../FormStep'
import { addressSchema } from '../../types/schemas'
import { loanAPI } from '../../api/loanAPI'

export const Step3Address: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddressChange = async (value: string) => {
    updateFormData({ currentAddress: value })
    
    if (value.length > 3) {
      const addressSuggestions = await loanAPI.getAddressSuggestions(value)
      setSuggestions(addressSuggestions)
      setShowSuggestions(true)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    updateFormData({ currentAddress: suggestion })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleValidation = () => {
    try {
      const data = {
        currentAddress: formData.currentAddress || '',
        currentCity: formData.currentCity || '',
        currentState: formData.currentState || '',
        currentPincode: formData.currentPincode || '',
        currentCountry: formData.currentCountry || 'India',
        residenceSince: formData.residenceSince || '',
        permanentAddress: formData.permanentAddress,
        isSameAsCurrent: formData.isSameAsCurrent,
      }
      addressSchema.parse(data)
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
      stepNumber={3}
      title="Address Information"
      description="Enter your residential address"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      <div className="space-y-6">
        {/* Current Address with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Address *
          </label>
          <input
            type="text"
            value={formData.currentAddress || ''}
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.currentAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Street address"
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {errors.currentAddress && <p className="form-error">{errors.currentAddress}</p>}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.currentCity || ''}
              onChange={(e) => updateFormData({ currentCity: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.currentCity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mumbai"
            />
            {errors.currentCity && <p className="form-error">{errors.currentCity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={formData.currentState || ''}
              onChange={(e) => updateFormData({ currentState: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.currentState ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Maharashtra"
            />
            {errors.currentState && <p className="form-error">{errors.currentState}</p>}
          </div>
        </div>

        {/* Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode *
            </label>
            <input
              type="text"
              value={formData.currentPincode || ''}
              onChange={(e) => updateFormData({ currentPincode: e.target.value.slice(0, 6) })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.currentPincode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="400001"
              maxLength={6}
            />
            {errors.currentPincode && <p className="form-error">{errors.currentPincode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Residence Since *
            </label>
            <input
              type="date"
              value={formData.residenceSince || ''}
              onChange={(e) => updateFormData({ residenceSince: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.residenceSince ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.residenceSince && <p className="form-error">{errors.residenceSince}</p>}
          </div>
        </div>

        {/* Same as Current Address */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isSameAsCurrent || false}
              onChange={(e) => updateFormData({ isSameAsCurrent: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">
              Permanent address is same as current address
            </span>
          </label>
        </div>

        {/* Permanent Address (Conditional) */}
        {!formData.isSameAsCurrent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permanent Address
            </label>
            <textarea
              value={formData.permanentAddress || ''}
              onChange={(e) => updateFormData({ permanentAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Enter permanent address"
              rows={3}
            />
          </div>
        )}
      </div>
    </FormStep>
  )
}
