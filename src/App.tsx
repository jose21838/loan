import { Toaster } from 'react-hot-toast'
import { LoanApplicationForm } from './components/LoanApplicationForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanApplicationForm />
      <Toaster position="top-right" />
    </div>
  )
}

export default App
