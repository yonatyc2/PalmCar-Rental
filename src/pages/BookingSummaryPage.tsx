import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCarById } from '../lib/fleet'
import { CAR_TYPE_LABELS } from '../data/cars'
import { useAuth } from '../context/AuthContext'
import { saveBooking, isCarAvailableForDates } from '../lib/bookings'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { Booking } from '../types/car'

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysBetween(start: string, end: string): number {
  const a = parseDate(start)
  const b = parseDate(end)
  const diff = b.getTime() - a.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function BookingSummaryPage() {
  const { carId } = useParams<{ carId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const car = carId ? getCarById(carId) : undefined
  useDocumentTitle(car ? `Book ${car.name}` : 'Booking')

  const [pickupLocation, setPickupLocation] = useState('')
  const [returnLocation, setReturnLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [availabilityError, setAvailabilityError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setPickupLocation(params.get('pickup') || '')
    setReturnLocation(params.get('return') || '')
    setPickupDate(params.get('pickupDate') || '')
    setReturnDate(params.get('returnDate') || '')
  }, [])

  if (!car) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">Car not found</h1>
        <Link to="/cars" className="mt-4 inline-block text-brand-600 font-medium hover:underline">
          ← Back to cars
        </Link>
      </div>
    )
  }

  const typeLabel = CAR_TYPE_LABELS[car.type] ?? car.type
  const days = pickupDate && returnDate ? daysBetween(pickupDate, returnDate) : 0
  const totalPrice = days * car.pricePerDay

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    setAvailabilityError('')
    if (!car) return
    if (!isCarAvailableForDates(car.id, pickupDate, returnDate)) {
      setAvailabilityError('This vehicle is not available for the selected dates. It may already be booked.')
      return
    }
    const booking: Booking = {
      car,
      pickupLocation: pickupLocation || 'To be confirmed',
      returnLocation: returnLocation || pickupLocation || 'To be confirmed',
      pickupDate,
      returnDate,
      totalDays: days,
      totalPrice,
      bookingId: `BK-${Date.now()}`,
      userId: user?.id,
      createdAt: new Date().toISOString(),
    }
    saveBooking(booking)
    sessionStorage.setItem('lastBooking', JSON.stringify(booking))
    navigate('/booking/confirmation', { state: { booking } })
  }

  const canConfirm = pickupDate && returnDate && days > 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to={`/cars/${car.id}`}
        className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium text-sm mb-8"
      >
        ← Back to car
      </Link>

      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Booking summary</h1>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-slate-200">
          <img
            src={car.image}
            alt={car.name}
            className="w-full sm:w-48 h-40 object-cover rounded-xl"
          />
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-slate-900">{car.name}</h2>
            <p className="text-slate-600 text-sm mt-1">{typeLabel}</p>
            <p className="mt-2 text-slate-900">
              <span className="font-semibold">${car.pricePerDay}</span>
              <span className="text-slate-500 text-sm"> per day</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {availabilityError && (
            <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
              {availabilityError}
            </div>
          )}
          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-slate-700 mb-1">
              Pick-up location
            </label>
            <input
              id="pickup"
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="City or address"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label htmlFor="return" className="block text-sm font-medium text-slate-700 mb-1">
              Return location
            </label>
            <input
              id="return"
              type="text"
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              placeholder="Same as pick-up"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pickup-date" className="block text-sm font-medium text-slate-700 mb-1">
                Pick-up date
              </label>
              <input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label htmlFor="return-date" className="block text-sm font-medium text-slate-700 mb-1">
                Return date
              </label>
              <input
                id="return-date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                min={pickupDate}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {days > 0 && (
            <div className="rounded-xl bg-slate-50 p-4 flex justify-between items-center">
              <span className="text-slate-600">
                {days} day{days !== 1 ? 's' : ''} × ${car.pricePerDay}/day
              </span>
              <span className="font-display font-bold text-lg text-slate-900">
                ${totalPrice}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={!canConfirm}
            className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm booking
          </button>
        </form>
      </div>
    </div>
  )
}
