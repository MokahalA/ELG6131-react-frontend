import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import DocumentDigitizer from './page/DocumentDigitizer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DocumentDigitizer />
    </>
  )
}

export default App
