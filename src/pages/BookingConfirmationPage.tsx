import { Link, useLocation } from 'react-router-dom'
import type { Booking } from '../types/car'
import { CAR_TYPE_LABELS } from '../data/cars'
import { useAuth } from '../context/AuthContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function BookingConfirmationPage() {
  useDocumentTitle('Booking')
  const location = useLocation()
  const booking = (location.state as { booking?: Booking })?.booking

  if (!booking) {
    const stored = sessionStorage.getItem('lastBooking')
    const parsed = stored ? (JSON.parse(stored) as Booking) : null
    if (!parsed) {
      return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900">No booking found</h1>
          <p className="text-slate-600 mt-2">Start by choosing a car and completing a booking.</p>
          <Link
            to="/cars"
            className="mt-6 inline-block px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
          >
            Browse cars
          </Link>
        </div>
      )
    }
    // use parsed from sessionStorage for refresh
    return <ConfirmationContent booking={parsed} />
  }

  return <ConfirmationContent booking={booking} />
}

function ConfirmationContent({ booking }: { booking: Booking }) {
  const { user } = useAuth()
  const typeLabel = CAR_TYPE_LABELS[booking.car.type] ?? booking.car.type
  useDocumentTitle('Booking confirmed')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-brand-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Booking confirmed</h1>
        {booking.bookingId && (
          <p className="mt-2 text-slate-600">
            Your booking reference: <strong className="text-slate-900">{booking.bookingId}</strong>
          </p>
        )}

        <div className="mt-8 text-left rounded-xl bg-slate-50 p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Car</span>
            <span className="font-medium text-slate-900">{booking.car.name} ({typeLabel})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Pick-up</span>
            <span className="font-medium text-slate-900">
              {booking.pickupLocation} · {booking.pickupDate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Return</span>
            <span className="font-medium text-slate-900">
              {booking.returnLocation} · {booking.returnDate}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-600">Total ({booking.totalDays} days)</span>
            <span className="font-display font-bold text-slate-900">${booking.totalPrice}</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          We&apos;ll send a confirmation email with pickup instructions. See you on the road!
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          {user && (
            <Link
              to="/bookings"
              className="inline-flex justify-center px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
            >
              My bookings
            </Link>
          )}
          <Link
            to="/cars"
            className="inline-flex justify-center px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Browse more cars
          </Link>
          <Link
            to="/"
            className="inline-flex justify-center px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
