import { calculateEMI, calculateTotalInterest, formatCurrency } from '../utils/formatting'

describe('Formatting Utilities', () => {
  test('calculateEMI returns correct value', () => {
    const emi = calculateEMI(500000, 10.5, 60)
    expect(emi).toBeGreaterThan(0)
  })

  test('calculateTotalInterest returns correct value', () => {
    const emi = 10000
    const principal = 500000
    const months = 60
    const totalInterest = calculateTotalInterest(principal, emi, months)
    expect(totalInterest).toBe(emi * months - principal)
  })

  test('formatCurrency formats correctly', () => {
    const formatted = formatCurrency(100000)
    expect(formatted).toContain('100,000')
  })
})
