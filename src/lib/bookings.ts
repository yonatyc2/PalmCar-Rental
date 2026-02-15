import type { Booking, BookingStatus } from '../types/car'

const BOOKINGS_KEY = 'palmcar_bookings'

function getStored(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

function save(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}

export function getAllBookings(): Booking[] {
  return getStored()
}

export function getBookingsForUser(userId: string): Booking[] {
  return getStored().filter((b) => b.userId === userId)
}

export function saveBooking(booking: Booking): void {
  const list = getStored()
  const withStatus = { ...booking, status: (booking.status ?? 'confirmed') as BookingStatus }
  list.push(withStatus)
  save(list)
}

export function updateBookingStatus(bookingId: string, status: BookingStatus): boolean {
  const list = getStored()
  const i = list.findIndex((b) => b.bookingId === bookingId)
  if (i === -1) return false
  list[i] = { ...list[i], status }
  save(list)
  return true
}
