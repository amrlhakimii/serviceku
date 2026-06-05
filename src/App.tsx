import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { VehicleProvider } from './context/CarContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import AddVehicle from './pages/AddVehicle'
import ServiceList from './pages/ServiceList'
import AddService from './pages/AddService'
import FuelList from './pages/FuelList'
import AddFuel from './pages/AddFuel'
import CalendarPage from './pages/CalendarPage'
import Documents from './pages/Documents'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <p className="text-[#f8fafc] font-bold text-lg">ServiceKu</p>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-3" />
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/add" element={<AddVehicle />} />
        <Route path="/vehicles/edit/:id" element={<AddVehicle />} />
        {/* Legacy car routes redirect */}
        <Route path="/cars" element={<Navigate to="/vehicles" replace />} />
        <Route path="/cars/add" element={<Navigate to="/vehicles/add" replace />} />
        <Route path="/cars/edit/:id" element={<Navigate to="/vehicles" replace />} />
        <Route path="/service" element={<ServiceList />} />
        <Route path="/service/add" element={<AddService />} />
        <Route path="/fuel" element={<FuelList />} />
        <Route path="/fuel/add" element={<AddFuel />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <VehicleProvider>
        <AppRoutes />
      </VehicleProvider>
    </BrowserRouter>
  )
}
