import { create } from 'zustand'
import { LoanApplicationData, AutoSaveState, PreApprovalSummary } from '../types'

interface FormStore {
  formData: Partial<LoanApplicationData>
  currentStep: number
  autoSaveState: AutoSaveState
  completedSteps: Set<number>

  // Form actions
  updateFormData: (data: Partial<LoanApplicationData>) => void
  setCurrentStep: (step: number) => void
  markStepAsCompleted: (step: number) => void
  resetForm: () => void

  // Auto-save actions
  setAutoSaveState: (state: Partial<AutoSaveState>) => void
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
  clearAutoSave: () => void

  // Pre-approval actions
  setPreApprovalSummary: (summary: PreApprovalSummary) => void
}

const initialFormData: Partial<LoanApplicationData> = {
  loanType: 'personal',
  loanAmount: 0,
  loanTenure: 12,
  documents: [],
  termsAgreed: false,
  privacyAgreed: false,
  dataConsent: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const STORAGE_KEY = 'loan_application_form_data'
const AUTO_SAVE_INTERVAL = 30000 // 30 seconds

export const useFormStore = create<FormStore>((set, get) => ({
  formData: initialFormData,
  currentStep: 1,
  autoSaveState: {
    lastSavedAt: null,
    isDirty: false,
    isAutoSaving: false,
  },
  completedSteps: new Set(),

  updateFormData: (data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
        updatedAt: new Date().toISOString(),
      },
      autoSaveState: {
        ...state.autoSaveState,
        isDirty: true,
      },
    }))
  },

  setCurrentStep: (step) => {
    set({ currentStep: step })
  },

  markStepAsCompleted: (step) => {
    set((state) => {
      const updated = new Set(state.completedSteps)
      updated.add(step)
      return { completedSteps: updated }
    })
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      currentStep: 1,
      completedSteps: new Set(),
    })
    localStorage.removeItem(STORAGE_KEY)
  },

  setAutoSaveState: (state) => {
    set((prevState) => ({
      autoSaveState: {
        ...prevState.autoSaveState,
        ...state,
      },
    }))
  },

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedData = JSON.parse(saved)
        set({
          formData: parsedData,
          autoSaveState: {
            lastSavedAt: new Date().toISOString(),
            isDirty: false,
            isAutoSaving: false,
          },
        })
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  },

  saveToLocalStorage: () => {
    try {
      const { formData } = get()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      set((state) => ({
        autoSaveState: {
          ...state.autoSaveState,
          lastSavedAt: new Date().toISOString(),
          isDirty: false,
        },
      }))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  clearAutoSave: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({
      autoSaveState: {
        lastSavedAt: null,
        isDirty: false,
        isAutoSaving: false,
      },
    })
  },

  setPreApprovalSummary: (summary) => {
    set((state) => ({
      formData: {
        ...state.formData,
        preApprovalSummary: summary,
      },
    }))
  },
}))
