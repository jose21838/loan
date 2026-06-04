import { personalInfoSchema, addressSchema } from '../types/schemas'

describe('Validation Schemas', () => {
  test('personalInfoSchema validates correct data', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543210',
      dob: '1990-01-01',
      gender: 'male' as const,
    }
    expect(() => personalInfoSchema.parse(data)).not.toThrow()
  })

  test('personalInfoSchema rejects invalid email', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '9876543210',
      dob: '1990-01-01',
      gender: 'male' as const,
    }
    expect(() => personalInfoSchema.parse(data)).toThrow()
  })

  test('addressSchema validates correct data', () => {
    const data = {
      currentAddress: '123 Main Street, Apt 4B',
      currentCity: 'Mumbai',
      currentState: 'Maharashtra',
      currentPincode: '400001',
      currentCountry: 'India',
      residenceSince: '2020-01-01',
      permanentAddress: undefined,
      isSameAsCurrent: true,
    }
    expect(() => addressSchema.parse(data)).not.toThrow()
  })
})
