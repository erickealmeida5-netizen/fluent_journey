
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AccessPage from './features/access/AccessPage'
import DashboardPage from './features/dashboard/DashboardPage'
import WelcomePage from './features/welcome/WelcomePage'
import './App.css'

function App() {
  return (
    <BrowserRouter basename="/fluent_journey">
      <Routes>
        <Route path="/" element={<AccessPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
