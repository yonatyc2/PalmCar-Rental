import { useState, useEffect } from 'react'
import type { Car, CarType } from '../types/car'
import { CAR_TYPE_LABELS } from '../data/cars'

const CAR_TYPES: CarType[] = ['economy', 'compact', 'midsize', 'suv', 'luxury']

interface CarFormProps {
  car?: Car | null
  onSubmit: (data: Omit<Car, 'id'>) => void
  onCancel: () => void
}

export default function CarForm({ car, onSubmit, onCancel }: CarFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<CarType>('economy')
  const [image, setImage] = useState('')
  const [imagesText, setImagesText] = useState('')
  const [pricePerDay, setPricePerDay] = useState(50)
  const [seats, setSeats] = useState(5)
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic')
  const [fuel, setFuel] = useState('Petrol')
  const [ac, setAc] = useState(true)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (car) {
      setName(car.name)
      setType(car.type)
      setImage(car.image)
      setImagesText(car.images.join('\n'))
      setPricePerDay(car.pricePerDay)
      setSeats(car.seats)
      setTransmission(car.transmission)
      setFuel(car.fuel)
      setAc(car.ac)
      setDescription(car.description)
    }
  }, [car])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const images = imagesText.trim() ? imagesText.trim().split(/\n/).map((s) => s.trim()).filter(Boolean) : [image]
    onSubmit({
      name: name.trim(),
      type,
      image: image.trim() || (images[0] ?? ''),
      images: images.length > 0 ? images : [image.trim()],
      pricePerDay,
      seats,
      transmission,
      fuel: fuel.trim(),
      ac,
      description: description.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
      <h3 className="font-display font-semibold text-slate-900">{car ? 'Edit vehicle' : 'Add vehicle'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CarType)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {CAR_TYPES.map((t) => (
              <option key={t} value={t}>{CAR_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Main image URL</label>
        <input
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Additional image URLs (one per line)</label>
        <textarea
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          placeholder="Optional"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Price/day ($)</label>
          <input
            type="number"
            min={1}
            value={pricePerDay}
            onChange={(e) => setPricePerDay(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seats</label>
          <input
            type="number"
            min={1}
            max={9}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Transmission</label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as 'automatic' | 'manual')}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fuel</label>
          <input
            type="text"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={ac} onChange={(e) => setAc(e.target.checked)} className="rounded" />
          <span className="text-sm font-medium text-slate-700">Air conditioning</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700"
        >
          {car ? 'Save changes' : 'Add vehicle'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
