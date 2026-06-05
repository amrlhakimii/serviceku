import { createContext, useContext, useState } from 'react'
import type { Vehicle } from '../types/vehicle'

interface VehicleContextType {
  selectedVehicle: Vehicle | null
  setSelectedVehicle: (v: Vehicle | null) => void
}

const VehicleContext = createContext<VehicleContextType>({
  selectedVehicle: null,
  setSelectedVehicle: () => {},
})

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  return (
    <VehicleContext.Provider value={{ selectedVehicle, setSelectedVehicle }}>
      {children}
    </VehicleContext.Provider>
  )
}

export const useSelectedVehicle = () => useContext(VehicleContext)

// backward-compat aliases
export const CarProvider = VehicleProvider
export const useSelectedCar = useSelectedVehicle
