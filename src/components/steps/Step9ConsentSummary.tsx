import React, { useState, useEffect } from 'react'
import { useFormStore } from '@store/index'
import { FormStep } from '../FormStep'
import { loanAPI } from '@api/loanAPI'
import toast from 'react-hot-toast'

export const Step9ConsentSummary: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [isGeneratingPreApproval, setIsGeneratingPreApproval] = useState(false)

  useEffect(() => {
    // Generate pre-approval on step load
    if (!formData.preApprovalSummary) {
      generatePreApproval()
    }
  }, [])

  const generatePreApproval = async () => {
    setIsGeneratingPreApproval(true)
    try {
      const summary = await loanAPI.generatePreApproval(formData)
      updateFormData({ preApprovalSummary: summary })
      toast.success('Pre-approval generated successfully')
    } catch (error) {
      toast.error('Failed to generate pre-approval')
    } finally {
      setIsGeneratingPreApproval(false)
    }
  }

  const handleValidation = () => {
    if (!formData.termsAgreed || !formData.privacyAgreed || !formData.dataConsent) {
      toast.error('Please agree to all terms and conditions')
      return false
    }
    return true
  }

  return (
    <FormStep
      stepNumber={9}
      title="Consent & Pre-Approval Summary"
      description="Review your application and agree to terms"
      onNext={handleValidation}
      onPrev={() => {}}
      isLastStep={true}
    >
      <div className="space-y-6">
        {/* Pre-Approval Summary */}
        {formData.preApprovalSummary && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">Pre-Approval Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-green-700 font-medium">Loan Amount</p>
                <p className="text-lg font-bold text-green-900">
                  ₹{formData.preApprovalSummary.loanAmount?.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-medium">Eligible Amount</p>
                <p className="text-lg font-bold text-green-900">
                  ₹{formData.preApprovalSummary.eligibleAmount?.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-medium">Estimated EMI</p>
                <p className="text-lg font-bold text-green-900">
                  ₹{formData.preApprovalSummary.estimatedEmi?.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-medium">Rate of Interest</p>
                <p className="text-lg font-bold text-green-900">
                  {formData.preApprovalSummary.rateOfInterest?.toFixed(2)}% p.a.
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-medium">Tenure</p>
                <p className="text-lg font-bold text-green-900">
                  {formData.preApprovalSummary.tenor} months
                </p>
              </div>
              <div>
                <p className="text-xs text-green-700 font-medium">Status</p>
                <p className="text-lg font-bold text-green-900 capitalize">
                  {formData.preApprovalSummary.status}
                </p>
              </div>
            </div>

            {formData.preApprovalSummary.conditions && (
              <div className="mb-4">
                <p className="text-sm font-medium text-green-900 mb-2">Conditions:</p>
                <ul className="text-sm text-green-800 space-y-1 ml-4">
                  {formData.preApprovalSummary.conditions.map((condition: string, idx: number) => (
                    <li key={idx} className="list-disc">{condition}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.preApprovalSummary.nextSteps && (
              <div>
                <p className="text-sm font-medium text-green-900 mb-2">Next Steps:</p>
                <ul className="text-sm text-green-800 space-y-1 ml-4">
                  {formData.preApprovalSummary.nextSteps.map((step: string, idx: number) => (
                    <li key={idx} className="list-disc">{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {isGeneratingPreApproval && (
          <div className="text-center py-4">
            <p className="text-gray-600">Generating pre-approval...</p>
          </div>
        )}

        {/* Consent Checkboxes */}
        <div className="space-y-4 border-t pt-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.termsAgreed || false}
              onChange={(e) => updateFormData({ termsAgreed: e.target.checked })}
              className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">
              I agree to the <a href="#" className="text-primary-600 hover:underline">Terms and Conditions</a>
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.privacyAgreed || false}
              onChange={(e) => updateFormData({ privacyAgreed: e.target.checked })}
              className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">
              I agree to the <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
            </span>
          </label>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.dataConsent || false}
              onChange={(e) => updateFormData({ dataConsent: e.target.checked })}
              className="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">
              I consent to share my personal and financial data for loan processing and verification
            </span>
          </label>
        </div>

        {/* Application Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Application Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Loan Type:</span>
              <span className="font-medium text-gray-900 capitalize">{formData.loanType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Applicant:</span>
              <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Application Date:</span>
              <span className="font-medium text-gray-900">
                {new Date(formData.createdAt || Date.now()).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </FormStep>
  )
}
