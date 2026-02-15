import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getFleet, addCar, updateCar, deleteCar, getCarById } from '../lib/fleet'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getAllBookings, updateBookingStatus } from '../lib/bookings'
import { CAR_TYPE_LABELS } from '../data/cars'
import type { Car } from '../types/car'
import type { BookingStatus } from '../types/car'
import CarForm from '../components/CarForm'

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminPage() {
  useDocumentTitle('Admin')
  const [fleetKey, setFleetKey] = useState(0)
  const [bookingsKey, setBookingsKey] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCarId, setEditingCarId] = useState<string | null>(null)

  const fleet = useMemo(() => getFleet(), [fleetKey])
  const bookings = useMemo(() => getAllBookings().slice().reverse(), [bookingsKey])
  const editingCar = editingCarId ? getCarById(editingCarId) : null

  function handleAddCar(data: Omit<Car, 'id'>) {
    addCar(data)
    setFleetKey((k) => k + 1)
    setShowAddForm(false)
  }

  function handleUpdateCar(data: Omit<Car, 'id'>) {
    if (!editingCarId) return
    updateCar(editingCarId, data)
    setFleetKey((k) => k + 1)
    setEditingCarId(null)
  }

  function handleDeleteCar(id: string) {
    if (!confirm('Remove this vehicle from the fleet?')) return
    deleteCar(id)
    setFleetKey((k) => k + 1)
    setEditingCarId(null)
  }

  function handleBookingStatusChange(bookingId: string, status: BookingStatus) {
    updateBookingStatus(bookingId, status)
    setBookingsKey((k) => k + 1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin</h1>
          <p className="mt-1 text-slate-600">Fleet and booking management</p>
        </div>
        <Link
          to="/admin/reports"
          className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
        >
          Reports & export
        </Link>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-slate-900">Fleet ({fleet.length} vehicles)</h2>
          {!showAddForm && !editingCarId && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
            >
              Add vehicle
            </button>
          )}
        </div>

        {(showAddForm || editingCarId) && (
          <div className="mb-6">
            <CarForm
              car={editingCar}
              onSubmit={editingCar ? handleUpdateCar : handleAddCar}
              onCancel={() => {
                setShowAddForm(false)
                setEditingCarId(null)
              }}
            />
          </div>
        )}

        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">Car</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Type</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Price/day</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Seats</th>
                  <th className="px-4 py-3 font-medium text-slate-700 w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((car) => (
                  <tr key={car.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{car.name}</td>
                    <td className="px-4 py-3 text-slate-600">{CAR_TYPE_LABELS[car.type] ?? car.type}</td>
                    <td className="px-4 py-3 text-slate-600">${car.pricePerDay}</td>
                    <td className="px-4 py-3 text-slate-600">{car.seats}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditingCarId(car.id); setShowAddForm(false); }}
                          className="text-brand-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCar(car.id)}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">All bookings ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            No bookings yet.
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-700">Ref</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Car</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Dates</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Total</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.bookingId ?? b.pickupDate + b.car.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-slate-600">{b.bookingId ?? '—'}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{b.car.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {b.pickupDate} → {b.returnDate}
                      </td>
                      <td className="px-4 py-3 text-slate-600">${b.totalPrice}</td>
                      <td className="px-4 py-3">
                        {b.bookingId ? (
                          <select
                            value={b.status ?? 'confirmed'}
                            onChange={(e) => handleBookingStatusChange(b.bookingId!, e.target.value as BookingStatus)}
                            className="rounded border border-slate-300 px-2 py-1 text-sm"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <p className="mt-8">
        <Link to="/" className="text-brand-600 font-medium hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  )
}
