import { useEffect, useCallback } from 'react'
import { useFormStore } from '../store'

const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

export const useAutoSave = () => {
  const { formData, autoSaveState, saveToLocalStorage, setAutoSaveState } = useFormStore()

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('loan_application_form_data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        useFormStore.setState({ formData: parsed })
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [])

  // Auto-save interval
  useEffect(() => {
    if (!autoSaveState.isDirty) return

    const timer = setTimeout(() => {
      setAutoSaveState({ isAutoSaving: true })
      
      // Simulate save delay
      setTimeout(() => {
        saveToLocalStorage()
        setAutoSaveState({ isAutoSaving: false })
      }, 500)
    }, AUTO_SAVE_INTERVAL)

    return () => clearTimeout(timer)
  }, [autoSaveState.isDirty, saveToLocalStorage, setAutoSaveState])

  const getLastSavedTime = useCallback(() => {
    if (!autoSaveState.lastSavedAt) return null
    return new Date(autoSaveState.lastSavedAt)
  }, [autoSaveState.lastSavedAt])

  return {
    autoSaveState,
    getLastSavedTime,
  }
}

export const useStepValidation = () => {
  const validatePersonalInfo = useCallback((formData: any) => {
    const errors: Record<string, string> = {}

    if (!formData.firstName?.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required'
    if (!formData.email?.trim()) errors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '')) {
      errors.email = 'Invalid email format'
    }
    if (!formData.phone?.trim()) errors.phone = 'Phone is required'
    if (!/^\d{10}$/.test(formData.phone || '')) {
      errors.phone = 'Phone must be 10 digits'
    }
    if (!formData.dob) errors.dob = 'Date of birth is required'
    if (!formData.gender) errors.gender = 'Gender is required'

    return { isValid: Object.keys(errors).length === 0, errors }
  }, [])

  const validateAddress = useCallback((formData: any) => {
    const errors: Record<string, string> = {}

    if (!formData.currentAddress?.trim()) errors.currentAddress = 'Address is required'
    if (!formData.currentCity?.trim()) errors.currentCity = 'City is required'
    if (!formData.currentState?.trim()) errors.currentState = 'State is required'
    if (!formData.currentPincode?.trim()) errors.currentPincode = 'Pincode is required'
    if (!/^\d{6}$/.test(formData.currentPincode || '')) {
      errors.currentPincode = 'Pincode must be 6 digits'
    }
    if (!formData.residenceSince) errors.residenceSince = 'Residence since is required'

    return { isValid: Object.keys(errors).length === 0, errors }
  }, [])

  const validateVerification = useCallback((formData: any) => {
    const errors: Record<string, string> = {}

    if (!formData.panNumber?.trim()) errors.panNumber = 'PAN is required'
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber || '')) {
      errors.panNumber = 'Invalid PAN format'
    }
    if (!formData.aadhaarNumber?.trim()) errors.aadhaarNumber = 'Aadhaar is required'
    if (!/^\d{12}$/.test(formData.aadhaarNumber || '')) {
      errors.aadhaarNumber = 'Aadhaar must be 12 digits'
    }

    return { isValid: Object.keys(errors).length === 0, errors }
  }, [])

  return {
    validatePersonalInfo,
    validateAddress,
    validateVerification,
  }
}
