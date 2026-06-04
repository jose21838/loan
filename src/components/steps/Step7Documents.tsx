import React, { useState } from 'react'
import { useFormStore } from '@store/index'
import { FormStep } from '../FormStep'
import { DocumentUpload } from '../DocumentUpload'
import type { DocumentType } from '../../types'
import toast from 'react-hot-toast'

const DOCUMENT_TYPES: { value: DocumentType; label: string; description: string }[] = [
  { value: 'identity', label: 'Identity Proof', description: 'Passport, Driving License, or Voter ID' },
  { value: 'address_proof', label: 'Address Proof', description: 'Utility Bill, Rent Agreement, or Latest Bank Statement' },
  { value: 'income', label: 'Income Proof', description: 'Salary Slips or ITR' },
  { value: 'property', label: 'Property Documents', description: 'Required for Home Loans only' },
  { value: 'business_registration', label: 'Business Registration', description: 'Required for Business Loans' },
  { value: 'gst_certificate', label: 'GST Certificate', description: 'Required for Business Loans' },
]

export const Step7Documents: React.FC = () => {
  const { formData, updateFormData } = useFormStore()
  const [requiredDocs] = React.useState<DocumentType[]>(getRequiredDocs(formData.loanType))

  function getRequiredDocs(loanType?: string): DocumentType[] {
    switch (loanType) {
      case 'personal':
        return ['identity', 'address_proof', 'income']
      case 'home':
        return ['identity', 'address_proof', 'income', 'property']
      case 'business':
        return ['identity', 'address_proof', 'business_registration', 'gst_certificate']
      default:
        return []
    }
  }

  const handleDocumentUpload = (documentType: DocumentType, file: File, fileUrl: string) => {
    const documents = formData.documents || []
    const existingIndex = documents.findIndex((d) => d.type === documentType)

    const newDoc = {
      type: documentType,
      fileUrl,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      verified: false,
    }

    if (existingIndex >= 0) {
      documents[existingIndex] = newDoc
    } else {
      documents.push(newDoc)
    }

    updateFormData({ documents })
  }

  const handleValidation = () => {
    const uploadedDocs = formData.documents || []
    const missingDocs = requiredDocs.filter(
      (docType) => !uploadedDocs.find((d) => d.type === docType)
    )

    if (missingDocs.length > 0) {
      toast.error(`Missing required documents: ${missingDocs.join(', ')}`)
      return false
    }

    return true
  }

  return (
    <FormStep
      stepNumber={7}
      title="Document Upload"
      description="Upload required documents for verification"
      onNext={handleValidation}
      onPrev={() => {}}
    >
      <div className="space-y-6">
        {/* Document Upload Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium">Required Documents:</p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4">
            {requiredDocs.map((docType) => {
              const docInfo = DOCUMENT_TYPES.find((d) => d.value === docType)
              return (
                <li key={docType} className="list-disc">
                  {docInfo?.label}: {docInfo?.description}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Document Upload Components */}
        {requiredDocs.map((docType: DocumentType) => {
          const docInfo = DOCUMENT_TYPES.find((d) => d.value === docType)
          const uploadedDoc = formData.documents?.find((d) => d.type === docType)

          return (
            <div
              key={docType}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 mb-2">
                {docInfo?.label}
                {uploadedDoc && <span className="text-green-600 text-sm ml-2">✓ Uploaded</span>}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{docInfo?.description}</p>
              <DocumentUpload
                documentType={docInfo?.label || ''}
                onUpload={(file, fileUrl) => handleDocumentUpload(docType, file, fileUrl)}
                maxSizeMB={5}
              />
            </div>
          )
        })}

        {/* Upload Summary */}
        {(formData.documents || []).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-medium">
              {formData.documents?.length} of {requiredDocs.length} documents uploaded
            </p>
            {formData.documents?.map((doc: any) => (
              <p key={doc.type} className="text-xs text-green-700 mt-1">
                ✓ {DOCUMENT_TYPES.find((d) => d.value === doc.type)?.label}
              </p>
            ))}
          </div>
        )}
      </div>
    </FormStep>
  )
}
