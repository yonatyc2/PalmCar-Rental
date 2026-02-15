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

/** Date ranges overlap if (startA <= endB) and (startB <= endA). */
function dateRangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA <= endB && startB <= endA
}

export function getAllBookings(): Booking[] {
  return getStored()
}

export function getBookingsForUser(userId: string): Booking[] {
  return getStored().filter((b) => b.userId === userId)
}

/** Bookings for a specific car (any status). */
export function getBookingsForCar(carId: string): Booking[] {
  return getStored().filter((b) => b.car.id === carId)
}

/**
 * True if the car has no confirmed booking that overlaps the given date range.
 * Only "confirmed" bookings block availability; completed/cancelled free the car.
 * Optionally exclude a booking by ID (e.g. when editing an existing booking).
 */
export function isCarAvailableForDates(
  carId: string,
  pickupDate: string,
  returnDate: string,
  excludeBookingId?: string
): boolean {
  const bookings = getStored().filter(
    (b) => b.car.id === carId && (b.status ?? 'confirmed') === 'confirmed'
  )
  for (const b of bookings) {
    if (excludeBookingId && b.bookingId === excludeBookingId) continue
    if (dateRangesOverlap(b.pickupDate, b.returnDate, pickupDate, returnDate)) return false
  }
  return true
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
