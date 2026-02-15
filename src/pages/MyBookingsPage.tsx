import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookingsForUser } from '../lib/bookings'
import { CAR_TYPE_LABELS } from '../data/cars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { Booking } from '../types/car'

function BookingCard({ booking }: { booking: Booking }) {
  const typeLabel = CAR_TYPE_LABELS[booking.car.type] ?? booking.car.type

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors">
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={booking.car.image}
          alt={booking.car.name}
          className="w-full sm:w-40 h-32 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display font-semibold text-slate-900">{booking.car.name}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {typeLabel}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              booking.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-brand-100 text-brand-700'
            }`}>
              {booking.status ?? 'confirmed'}
            </span>
            {booking.bookingId && (
              <span className="text-xs text-slate-500">Ref: {booking.bookingId}</span>
            )}
          </div>
          <p className="text-slate-600 text-sm mt-1">
            {booking.pickupDate} → {booking.returnDate} · {booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            {booking.pickupLocation} → {booking.returnLocation}
          </p>
          <p className="mt-2 font-display font-semibold text-slate-900">${booking.totalPrice} total</p>
        </div>
      </div>
    </div>
  )
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const bookings = useMemo(() => (user ? getBookingsForUser(user.id) : []), [user])
  useDocumentTitle('My bookings')

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-display text-2xl font-bold text-slate-900">My bookings</h1>
      <p className="mt-1 text-slate-600">Your rental history and upcoming trips</p>

      {bookings.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">You don&apos;t have any bookings yet.</p>
          <Link
            to="/cars"
            className="mt-4 inline-block px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
          >
            Browse cars
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.slice().reverse().map((b) => (
            <BookingCard key={b.bookingId ?? b.pickupDate + b.car.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}
