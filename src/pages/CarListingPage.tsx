import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getFleet } from '../lib/fleet'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { CAR_TYPE_LABELS } from '../data/cars'
import type { CarType } from '../types/car'

const CAR_TYPES: { value: '' | CarType; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'economy', label: 'Economy' },
  { value: 'compact', label: 'Compact' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'suv', label: 'SUV' },
  { value: 'luxury', label: 'Luxury' },
]

function CarCard({ car, view }: { car: ReturnType<typeof getFleet>[number]; view: 'grid' | 'list' }) {
  const typeLabel = CAR_TYPE_LABELS[car.type] ?? car.type

  if (view === 'list') {
    return (
      <Link
        to={`/cars/${car.id}`}
        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all"
      >
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="w-full sm:w-48 h-36 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display font-semibold text-slate-900">{car.name}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {typeLabel}
            </span>
          </div>
          <p className="text-slate-600 text-sm mt-1 line-clamp-2">{car.description}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            <span>{car.seats} seats</span>
            <span>{car.transmission}</span>
            <span>{car.fuel}</span>
            <span>{car.ac ? 'AC' : '—'}</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-end">
          <span className="font-display font-semibold text-lg text-slate-900">
            ${car.pricePerDay}
          </span>
          <span className="text-sm text-slate-500">per day</span>
          <span className="mt-2 text-brand-600 font-medium text-sm">View details →</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-semibold text-slate-900 truncate">{car.name}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
            {typeLabel}
          </span>
        </div>
        <p className="text-slate-600 text-sm mt-1 line-clamp-2">{car.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-3 text-xs text-slate-500">
            <span>{car.seats} seats</span>
            <span>{car.transmission}</span>
            <span>{car.ac ? 'AC' : '—'}</span>
          </div>
          <div className="text-right">
            <span className="font-display font-semibold text-slate-900">${car.pricePerDay}</span>
            <span className="text-slate-500 text-sm">/day</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CarListingPage() {
  useDocumentTitle('Fleet')
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = (searchParams.get('type') || '') as '' | CarType
  const priceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : null

  const [localType, setLocalType] = useState(typeFilter)
  const [localPriceMax, setLocalPriceMax] = useState(priceMax ?? '')

  // Sync filter state from URL when navigating with query params (e.g. from home search)
  useEffect(() => {
    setLocalType(typeFilter)
    setLocalPriceMax(priceMax ?? '')
  }, [typeFilter, priceMax])

  const filteredCars = useMemo(() => {
    return getFleet().filter((car) => {
      if (localType && car.type !== localType) return false
      if (localPriceMax !== '' && car.pricePerDay > Number(localPriceMax)) return false
      return true
    })
  }, [localType, localPriceMax])

  function applyFilters() {
    const next = new URLSearchParams(searchParams)
    if (localType) next.set('type', localType)
    else next.delete('type')
    if (localPriceMax !== '') next.set('priceMax', String(localPriceMax))
    else next.delete('priceMax')
    setSearchParams(next)
  }

  function setViewMode(mode: 'grid' | 'list') {
    const next = new URLSearchParams(searchParams)
    next.set('view', mode)
    setSearchParams(next)
  }

  const activeView = searchParams.get('view') || 'grid'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Fleet
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${activeView === 'grid' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="Grid view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${activeView === 'list' ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="List view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white p-4 sticky top-24">
            <h2 className="font-display font-semibold text-slate-900 mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <select
                  value={localType}
                  onChange={(e) => setLocalType(e.target.value as '' | CarType)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {CAR_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Max price/day
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  placeholder="Any"
                  value={localPriceMax}
                  onChange={(e) => setLocalPriceMax(e.target.value === '' ? '' : e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="button"
                onClick={applyFilters}
                className="w-full py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                Apply filters
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <p className="text-slate-600 mb-4">
            {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
          </p>
          {activeView === 'list' ? (
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} view="list" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} view="grid" />
              ))}
            </div>
          )}
          {filteredCars.length === 0 && (
            <div className="text-center py-12 rounded-xl bg-slate-50 border border-slate-200 px-4">
              <p className="text-slate-600 font-medium">
                {getFleet().length === 0 ? 'No vehicles in fleet.' : 'No cars match your filters.'}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {getFleet().length === 0 ? 'Add vehicles in Admin.' : 'Try adjusting filters.'}
              </p>
              <Link
                to={getFleet().length === 0 ? '/admin' : '/cars'}
                className="mt-4 inline-block text-brand-600 font-medium hover:underline"
              >
                {getFleet().length === 0 ? 'Go to Admin' : 'Clear filters'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
