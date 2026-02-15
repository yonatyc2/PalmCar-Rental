import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const carTypes = [
  { value: '', label: 'Any type' },
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
]

export default function CarSearchForm() {
  const navigate = useNavigate()
  const [pickup, setPickup] = useState('')
  const [returnLoc, setReturnLoc] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [carType, setCarType] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (pickup) params.set('pickup', pickup)
    if (returnLoc) params.set('return', returnLoc)
    if (pickupDate) params.set('pickupDate', pickupDate)
    if (returnDate) params.set('returnDate', returnDate)
    if (carType) params.set('type', carType)
    navigate(`/cars${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div id="search" className="rounded-2xl bg-white shadow-xl border border-slate-200/80 p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">New rental / Search fleet</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-slate-700 mb-1.5">
            Pick-up location
          </label>
          <input
            id="pickup"
            type="text"
            placeholder="City or airport"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="return" className="block text-sm font-medium text-slate-700 mb-1.5">
            Return location
          </label>
          <input
            id="return"
            type="text"
            placeholder="Same as pick-up"
            value={returnLoc}
            onChange={(e) => setReturnLoc(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="pickup-date" className="block text-sm font-medium text-slate-700 mb-1.5">
            Pick-up date
          </label>
          <input
            id="pickup-date"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="return-date" className="block text-sm font-medium text-slate-700 mb-1.5">
            Return date
          </label>
          <input
            id="return-date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
          <label htmlFor="car-type" className="block text-sm font-medium text-slate-700 mb-1.5">
            Car type
          </label>
          <select
            id="car-type"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {carTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
          >
            Search cars
          </button>
        </div>
      </form>
    </div>
  )
}
