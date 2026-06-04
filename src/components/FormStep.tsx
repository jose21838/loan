import React from 'react'
import { useFormStore } from '../store'

interface FormStepProps {
  stepNumber: number
  title: string
  description?: string
  children: React.ReactNode
  onNext: () => boolean
  onPrev: () => void
  isLastStep?: boolean
}

export const FormStep: React.FC<FormStepProps> = ({
  stepNumber,
  title,
  description,
  children,
  onNext,
  onPrev,
  isLastStep = false,
}) => {
  const { setCurrentStep } = useFormStore()

  const handleNext = () => {
    if (onNext()) {
      setCurrentStep(stepNumber + 1)
    }
  }

  const handlePrev = () => {
    onPrev()
    setCurrentStep(stepNumber - 1)
  }

  return (
    <div className="form-section animate-fade-in">
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            Step {stepNumber}
          </span>
        </div>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-600">Progress: {stepNumber} of 9</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stepNumber / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-8">{children}</div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        {stepNumber > 1 && (
          <button
            onClick={handlePrev}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
          >
            Previous
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastStep ? 'Submit Application' : 'Next'}
        </button>
      </div>
    </div>
  )
}
