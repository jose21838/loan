# Loan Application Form

A production-grade, multi-step loan application form with advanced features including real-time validation, document upload with compression, e-signature capture, auto-save functionality, and pre-approval summary generation.

## Features

### ✅ Core Features
- **8-Step Multi-Step Form**: Complete loan application process broken into logical steps
- **Real-Time Validation**: Client-side validation with immediate feedback using Zod schemas
- **Conditional Field Rendering**: Dynamic forms based on loan type (Personal, Home, Business)
- **Auto-Save with Resume**: Automatic saving to localStorage every 30 seconds with restore capability
- **Document Upload**: Drag-and-drop document upload with:
  - Image compression
  - File size validation
  - Multiple format support
  - Preview functionality
- **E-Signature Capture**: Canvas-based signature capture with timestamp
- **Pre-Approval Summary**: Instant EMI calculation and eligibility assessment
- **Cross-Step Validation**: Validation dependencies between different form steps

### 🔐 Security & Verification
- PAN Number Verification (with format validation)
- Aadhaar Number Verification (with masking)
- Address Autocomplete
- Identity and financial document requirements
- Encrypted signature storage

### 💾 Data Management
- Persistent storage with localStorage
- Auto-save state tracking
- Form data recovery from sessions
- Submission tracking and confirmation

### 🎯 Loan Types with Specific Requirements
1. **Personal Loan**
   - Employment details required
   - Income verification
   - Simpler documentation

2. **Home Loan**
   - Employment verification
   - Property documents required
   - Income proof (6 months bank statements)
   - Higher amount eligibility

3. **Business Loan**
   - Business registration documents
   - GST certificate
   - Annual turnover verification
   - Business age consideration

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Form Management**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: 
  - Jest & React Testing Library (Unit tests)
  - Cypress (E2E tests)
- **File Handling**: Canvas for signatures, Image compression utilities
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── components/
│   ├── FormStep.tsx              # Reusable form step wrapper
│   ├── DocumentUpload.tsx        # File upload with compression
│   ├── ESignaturePad.tsx         # E-signature canvas component
│   ├── LoanApplicationForm.tsx   # Main form orchestrator
│   └── steps/
│       ├── Step1LoanType.tsx     # Loan type selection
│       ├── Step2PersonalInfo.tsx # Personal details
│       ├── Step3Address.tsx      # Address with autocomplete
│       ├── Step4Verification.tsx # PAN/Aadhaar verification
│       ├── Step5Employment.tsx   # Employment/Business info
│       ├── Step6Financial.tsx    # Financial details
│       ├── Step7Documents.tsx    # Document upload
│       ├── Step8ESignature.tsx   # E-signature capture
│       └── Step9ConsentSummary.tsx # Consent & pre-approval
├── store/
│   └── index.ts                  # Zustand store (form state & auto-save)
├── types/
│   ├── index.ts                  # TypeScript types
│   └── schemas.ts                # Zod validation schemas
├── hooks/
│   └── useFormLogic.ts           # Custom hooks (auto-save, validation)
├── api/
│   └── loanAPI.ts                # API client for verification & submission
├── utils/
│   ├── fileHandling.ts           # Image compression & validation
│   └── formatting.ts             # Utilities (currency, EMI, etc.)
└── __tests__/
    ├── validation.test.ts        # Schema validation tests
    ├── utils.test.ts             # Utility function tests
    └── LoanApplicationForm.test.tsx # Component tests
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the application at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

### Testing

**Unit Tests:**
```bash
npm run test
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

**E2E Tests:**
```bash
npm run e2e             # Opens Cypress UI
npm run e2e:headless    # Headless mode
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

## Form Steps Breakdown

### Step 1: Loan Type Selection
- Select loan type (Personal/Home/Business)
- Enter loan amount and tenure
- Optional: Purpose of loan

### Step 2: Personal Information
- Name, email, phone
- Date of birth with age validation
- Gender selection

### Step 3: Address Information
- Current address with autocomplete
- City, state, pincode
- Residence since date
- Optional: Permanent address

### Step 4: Verification
- PAN number verification
- Aadhaar number verification
- Real-time verification API calls
- Masked display of sensitive data

### Step 5: Employment/Business Information
- **For Personal/Home Loans**: Employment type, company, designation, experience, income
- **For Business Loans**: Business type, registration number, age, annual turnover

### Step 6: Financial Information
- Savings account details
- Account balance
- Existing loans tracking (with EMI details)
- Credit score (optional)

### Step 7: Document Upload
- Context-aware document requirements
- Drag-and-drop upload
- Image preview and compression
- Progress tracking

### Step 8: E-Signature
- Canvas-based signature pad
- Clear and redraw options
- Signature timestamp capture

### Step 9: Consent & Pre-Approval
- Terms and conditions agreement
- Privacy policy consent
- Data sharing consent
- Pre-approval summary with:
  - Eligible loan amount
  - Estimated EMI
  - Rate of interest
  - Conditions and next steps

## Validation Rules

### Personal Information
- Email: Valid email format
- Phone: Exactly 10 digits
- Age: Between 18-65 years
- Name: Non-empty, max 50 chars

### Address
- Pincode: Exactly 6 digits
- Address: Minimum 10 characters

### Verification
- PAN: Format AAAAA0000A (5 letters, 4 digits, 1 letter)
- Aadhaar: Exactly 12 digits

### Financial
- Loan Amount: Minimum ₹10,000
- Tenure: 1-240 months

## Cross-Step Validation

The form implements dependencies between steps:
- Loan type affects employment/business fields (Step 5)
- Loan type determines required documents (Step 7)
- Monthly income affects pre-approval amount (Step 9)
- PAN/Aadhaar verification status impacts submission eligibility

## Auto-Save Features

- **Interval**: 30 seconds
- **Storage**: Browser localStorage
- **Indication**: Auto-save status shown in UI
- **Recovery**: Automatic loading on page reload
- **Manual Override**: Clear auto-save option available

## Pre-Approval Calculation

EMI is calculated using the formula:
```
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
```

Where:
- P = Principal amount
- r = Monthly interest rate
- n = Number of months

## File Compression

Images are automatically compressed:
- Maximum width/height: 1200px
- Progressive quality reduction (80% → 10%)
- Target size: Configurable per upload
- Formats supported: JPEG, PNG, PDF

## API Endpoints (Simulated)

The application uses simulated API endpoints for:
- `/api/verify-pan` - PAN verification
- `/api/verify-aadhaar` - Aadhaar verification
- `/api/address-suggestions` - Address autocomplete
- `/api/pre-approval` - Pre-approval generation
- `/api/submit-application` - Application submission
- `/api/upload-document` - Document upload

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- Code splitting by step
- Lazy loading of components
- Image compression before upload
- Debounced API calls
- Optimized re-renders with Zustand

## Accessibility

- ARIA labels on form inputs
- Keyboard navigation support
- Semantic HTML structure
- Color contrast compliance (WCAG AA)
- Focus management

## Security Considerations

- PAN/Aadhaar masking in display
- No sensitive data in console logs
- HTTPS ready
- CSRF token support (when deployed)
- Input sanitization

## Future Enhancements

- Integration with real KYC APIs
- Multi-language support
- SMS OTP verification
- Video KYC
- Mobile app version
- Payment gateway integration
- Document OCR
- Advanced eligibility assessment

## Troubleshooting

### Auto-save not working
- Check browser localStorage permissions
- Verify localStorage quota is not exceeded
- Check browser console for errors

### Document upload fails
- Ensure file size is under 5MB
- Check file format is supported
- Verify browser has camera/file access permissions

### Verification timeout
- Simulated API has 1-2 second delay
- Verify network connectivity

## License

MIT

## Support

For issues or questions, please refer to the troubleshooting section or contact support.

---

**Note**: This is a demonstration application with simulated APIs. In production, integrate with actual KYC, verification, and banking APIs.
