import React, { useEffect } from 'react'
import { useFormStore } from '../store'
import { useAutoSave } from '../hooks/useFormLogic'
import { Step1LoanType } from './steps/Step1LoanType'
import { Step2PersonalInfo } from './steps/Step2PersonalInfo'
import { Step3Address } from './steps/Step3Address'
import { Step4Verification } from './steps/Step4Verification'
import { Step5Employment } from './steps/Step5Employment'
import { Step6Financial } from './steps/Step6Financial'
import { Step7Documents } from './steps/Step7Documents'
import { Step8ESignature } from './steps/Step8ESignature'
import { Step9ConsentSummary } from './steps/Step9ConsentSummary'
import { loanAPI } from '../api/loanAPI'
import toast from 'react-hot-toast'

export const LoanApplicationForm: React.FC = () => {
  const { currentStep, formData, updateFormData, loadFromLocalStorage } = useFormStore()
  const { autoSaveState } = useAutoSave()

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1LoanType />
      case 2:
        return <Step2PersonalInfo />
      case 3:
        return <Step3Address />
      case 4:
        return <Step4Verification />
      case 5:
        return <Step5Employment />
      case 6:
        return <Step6Financial />
      case 7:
        return <Step7Documents />
      case 8:
        return <Step8ESignature />
      case 9:
        return <Step9ConsentSummary />
      default:
        return <Step1LoanType />
    }
  }

  // Check if on last step for submission override
  const isLastStep = currentStep === 9

  return (
    <div className="form-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Loan Application</h1>
        <p className="text-gray-600">Complete your loan application in 9 easy steps</p>
      </div>

      {/* Auto-save Indicator */}
      <div className="mb-4 flex items-center justify-end">
        {autoSaveState.isAutoSaving && (
          <span className="text-xs text-blue-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Saving...
          </span>
        )}
        {autoSaveState.lastSavedAt && !autoSaveState.isAutoSaving && (
          <span className="text-xs text-gray-500">
            Last saved: {new Date(autoSaveState.lastSavedAt).toLocaleTimeString('en-IN')}
          </span>
        )}
      </div>

      {/* Form Steps */}
      <div>
        {renderStep()}
      </div>

      {/* Step Progress Indicator */}
      <div className="mt-8 flex justify-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
              step === currentStep
                ? 'bg-primary-600 text-white'
                : step < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
        ))}
      </div>
    </div>
  )
}
