import type { Car } from '../types/car'
import { CARS } from '../data/cars'

const FLEET_KEY = 'palmcar_fleet'

function getStored(): Car[] {
  try {
    const raw = localStorage.getItem(FLEET_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

function save(cars: Car[]) {
  localStorage.setItem(FLEET_KEY, JSON.stringify(cars))
}

/** Returns fleet from localStorage, or seeds with initial CARS and returns them. */
export function getFleet(): Car[] {
  const stored = getStored()
  if (stored.length > 0) return stored
  save([...CARS])
  return [...CARS]
}

export function getCarById(id: string): Car | undefined {
  return getFleet().find((c) => c.id === id)
}

export function addCar(car: Omit<Car, 'id'>): Car {
  const fleet = getFleet()
  const id = `car-${Date.now()}`
  const newCar: Car = { ...car, id }
  fleet.push(newCar)
  save(fleet)
  return newCar
}

export function updateCar(id: string, updates: Partial<Omit<Car, 'id'>>): Car | undefined {
  const fleet = getFleet()
  const i = fleet.findIndex((c) => c.id === id)
  if (i === -1) return undefined
  fleet[i] = { ...fleet[i], ...updates }
  save(fleet)
  return fleet[i]
}

export function deleteCar(id: string): boolean {
  const fleet = getFleet().filter((c) => c.id !== id)
  if (fleet.length === getFleet().length) return false
  save(fleet)
  return true
}
