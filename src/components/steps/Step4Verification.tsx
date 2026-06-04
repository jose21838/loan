import React, { useState } from 'react'
import { useFormStore } from '../../store'
import { FormStep } from '../FormStep'
import { verificationSchema } from '../../types/schemas'
import { loanAPI } from '../../api/loanAPI'
import { maskPAN, maskAadhaar } from '../../utils/formatting'
import toast from 'react-hot-toast'

export const Step4Verification: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [verifying, setVerifying] = useState({ pan: false, aadhaar: false })

  const handleValidation = () => {
    try {
      const data = {
        panNumber: formData.panNumber || '',
        aadhaarNumber: formData.aadhaarNumber || '',
      }
      verificationSchema.parse(data)
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

  const verifyPAN = async () => {
    if (!formData.panNumber) {
      setErrors((prev) => ({ ...prev, panNumber: 'PAN is required' }))
      return
    }

    setVerifying((prev) => ({ ...prev, pan: true }))
    try {
      const result = await loanAPI.verifyPAN(formData.panNumber)
      if (result.verified) {
        updateFormData({ panVerified: true, panVerificationStatus: 'verified' })
        toast.success('PAN verified successfully')
      } else {
        setErrors((prev) => ({ ...prev, panNumber: result.error || 'Verification failed' }))
        toast.error('PAN verification failed')
      }
    } catch (error) {
      toast.error('Verification error')
    } finally {
      setVerifying((prev) => ({ ...prev, pan: false }))
    }
  }

  const verifyAadhaar = async () => {
    if (!formData.aadhaarNumber) {
      setErrors((prev) => ({ ...prev, aadhaarNumber: 'Aadhaar is required' }))
      return
    }

    setVerifying((prev) => ({ ...prev, aadhaar: true }))
    try {
      const result = await loanAPI.verifyAadhaar(formData.aadhaarNumber)
      if (result.verified) {
        updateFormData({ aadhaarVerified: true, aadhaarVerificationStatus: 'verified' })
        toast.success('Aadhaar verified successfully')
      } else {
        setErrors((prev) => ({ ...prev, aadhaarNumber: result.error || 'Verification failed' }))
        toast.error('Aadhaar verification failed')
      }
    } catch (error) {
      toast.error('Verification error')
    } finally {
      setVerifying((prev) => ({ ...prev, aadhaar: false }))
    }
  }

  return (
    <FormStep
      stepNumber={4}
      title="Verification Details"
      description="Verify your identity with PAN and Aadhaar"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      <div className="space-y-6">
        {/* PAN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.panNumber || ''}
              onChange={(e) => updateFormData({ panNumber: e.target.value.toUpperCase() })}
              className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none uppercase ${
                errors.panNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="AAAAA0000A"
              maxLength={10}
            />
            <button
              onClick={verifyPAN}
              disabled={verifying.pan || formData.panVerified}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {verifying.pan ? 'Verifying...' : formData.panVerified ? 'Verified ✓' : 'Verify'}
            </button>
          </div>
          {formData.panNumber && !formData.panVerified && (
            <p className="text-xs text-gray-600 mt-1">Format: {maskPAN(formData.panNumber)}</p>
          )}
          {formData.panVerified && <p className="form-success">✓ PAN verified</p>}
          {errors.panNumber && <p className="form-error">{errors.panNumber}</p>}
        </div>

        {/* Aadhaar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhaar Number *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.aadhaarNumber || ''}
              onChange={(e) => updateFormData({ aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
              className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none ${
                errors.aadhaarNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123456789012"
              maxLength={12}
            />
            <button
              onClick={verifyAadhaar}
              disabled={verifying.aadhaar || formData.aadhaarVerified}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {verifying.aadhaar ? 'Verifying...' : formData.aadhaarVerified ? 'Verified ✓' : 'Verify'}
            </button>
          </div>
          {formData.aadhaarNumber && !formData.aadhaarVerified && (
            <p className="text-xs text-gray-600 mt-1">Format: {maskAadhaar(formData.aadhaarNumber)}</p>
          )}
          {formData.aadhaarVerified && <p className="form-success">✓ Aadhaar verified</p>}
          {errors.aadhaarNumber && <p className="form-error">{errors.aadhaarNumber}</p>}
        </div>

        {/* Verification Status Summary */}
        {(formData.panVerified || formData.aadhaarVerified) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Verification Status</h3>
            {formData.panVerified && <p className="text-sm text-green-800">✓ PAN verified</p>}
            {formData.aadhaarVerified && <p className="text-sm text-green-800">✓ Aadhaar verified</p>}
          </div>
        )}
      </div>
    </FormStep>
  )
}
