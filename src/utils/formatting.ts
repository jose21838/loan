export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const calculateEMI = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / months
  
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months)
  const denominator = Math.pow(1 + monthlyRate, months) - 1
  return numerator / denominator
}

export const calculateTotalInterest = (
  principal: number,
  emi: number,
  months: number
): number => {
  return emi * months - principal
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2')
}

export const maskAadhaar = (aadhaar: string): string => {
  return aadhaar.slice(0, 4) + ' ' + '*'.repeat(4) + ' ' + aadhaar.slice(-4)
}

export const maskPAN = (pan: string): string => {
  return pan.slice(0, 5) + '****' + pan.slice(-1)
}

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatDateISO = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

export const calculateAge = (dob: string): number => {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export const validateAge = (dob: string, minAge: number = 18, maxAge: number = 65): boolean => {
  const age = calculateAge(dob)
  return age >= minAge && age <= maxAge
}
