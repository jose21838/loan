import React, { useState } from 'react'
import { useFormStore } from '@store/index'
import { FormStep } from '../FormStep'
import { ESignaturePad } from '../ESignaturePad'
import toast from 'react-hot-toast'

export const Step8ESignature: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [showSignaturePad, setShowSignaturePad] = useState(false)

  const handleSignatureSave = (signatureData: string) => {
    updateFormData({
      signatureData,
      signatureCapturedAt: new Date().toISOString(),
    })
    setShowSignaturePad(false)
    toast.success('Signature captured successfully')
  }

  const handleValidation = () => {
    if (!formData.signatureData) {
      toast.error('Please capture your signature')
      return false
    }
    return true
  }

  return (
    <FormStep
      stepNumber={8}
      title="E-Signature"
      description="Capture your electronic signature"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      <div className="space-y-6">
        {/* Signature Pad */}
        {!showSignaturePad ? (
          <div>
            {formData.signatureData ? (
              <div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Your Signature:</p>
                  <img
                    src={formData.signatureData}
                    alt="Your signature"
                    className="border border-gray-300 rounded-lg bg-white"
                  />
                </div>
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="px-4 py-2 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
                >
                  Capture Signature Again
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Click the button below to capture your electronic signature.
                </p>
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Capture Signature
                </button>
              </div>
            )}
          </div>
        ) : (
          <ESignaturePad
            onSave={handleSignatureSave}
            onCancel={() => setShowSignaturePad(false)}
          />
        )}

        {/* Signature Declaration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Declaration:</strong> By providing your electronic signature, you agree that this signature has the same legal effect as your handwritten signature.
          </p>
        </div>
      </div>
    </FormStep>
  )
}
