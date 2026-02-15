export type CarType = 'economy' | 'compact' | 'midsize' | 'suv' | 'luxury'

export interface Car {
  id: string
  name: string
  type: CarType
  image: string
  images: string[]
  pricePerDay: number
  seats: number
  transmission: 'automatic' | 'manual'
  fuel: string
  ac: boolean
  description: string
}

export interface BookingSearchParams {
  pickup?: string
  return?: string
  pickupDate?: string
  returnDate?: string
  carType?: string
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
  car: Car
  pickupLocation: string
  returnLocation: string
  pickupDate: string
  returnDate: string
  totalDays: number
  totalPrice: number
  bookingId?: string
  userId?: string
  createdAt?: string
  status?: BookingStatus
}
