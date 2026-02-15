import type { Car } from '../types/car'
import type { Booking } from '../types/car'

function escapeCsvCell(value: string | number): string {
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function downloadFleetCsv(cars: Car[]): void {
  const headers = ['ID', 'Name', 'Type', 'Price/day', 'Seats', 'Transmission', 'Fuel', 'AC', 'Description']
  const rows = cars.map((c) => [
    c.id,
    c.name,
    c.type,
    c.pricePerDay,
    c.seats,
    c.transmission,
    c.fuel,
    c.ac ? 'Yes' : 'No',
    c.description,
  ])
  const csv = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `palmcar-fleet-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadBookingsCsv(bookings: Booking[]): void {
  const headers = ['Booking ID', 'Car', 'Car Type', 'Pick-up', 'Return', 'Pick-up Date', 'Return Date', 'Days', 'Total', 'Status', 'Created']
  const rows = bookings.map((b) => [
    b.bookingId ?? '',
    b.car.name,
    b.car.type,
    b.pickupLocation,
    b.returnLocation,
    b.pickupDate,
    b.returnDate,
    b.totalDays,
    b.totalPrice,
    b.status ?? 'confirmed',
    b.createdAt ?? '',
  ])
  const csv = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `palmcar-bookings-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
