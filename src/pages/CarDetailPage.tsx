import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCarById } from '../lib/fleet'
import { CAR_TYPE_LABELS } from '../data/cars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const car = id ? getCarById(id) : undefined
  const [galleryIndex, setGalleryIndex] = useState(0)
  useDocumentTitle(car ? car.name : 'Vehicle')

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

  function handleBook() {
    if (!car) return
    navigate(`/book/${car.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        to="/cars"
        className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium text-sm mb-6"
      >
        ← Back to cars
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={car.images[galleryIndex]}
              alt={`${car.name} view ${galleryIndex + 1}`}
              loading={galleryIndex === 0 ? 'eager' : 'lazy'}
              className="w-full aspect-[16/10] object-cover"
            />
            <div className="flex gap-2 p-3 overflow-x-auto">
              {car.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === galleryIndex ? 'border-brand-500 ring-2 ring-brand-200' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600">{car.description}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Specifications</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm text-slate-500">Type</dt>
                <dd className="font-medium text-slate-900">{typeLabel}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Seats</dt>
                <dd className="font-medium text-slate-900">{car.seats}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Transmission</dt>
                <dd className="font-medium text-slate-900 capitalize">{car.transmission}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Fuel</dt>
                <dd className="font-medium text-slate-900">{car.fuel}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Air conditioning</dt>
                <dd className="font-medium text-slate-900">{car.ac ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h1 className="font-display text-2xl font-bold text-slate-900">{car.name}</h1>
            <span className="inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              {typeLabel}
            </span>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-slate-900">
                ${car.pricePerDay}
              </span>
              <span className="text-slate-500">per day</span>
            </div>
            <button
              type="button"
              onClick={handleBook}
              className="mt-6 w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
            >
              Book this car
            </button>
            <p className="mt-4 text-sm text-slate-500 text-center">
              Pick-up and return dates selected on next step
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
