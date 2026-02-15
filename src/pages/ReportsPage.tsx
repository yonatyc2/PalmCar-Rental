import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getFleet } from '../lib/fleet'
import { getAllBookings } from '../lib/bookings'
import { downloadFleetCsv, downloadBookingsCsv } from '../lib/exportCsv'
import { CAR_TYPE_LABELS } from '../data/cars'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function ReportsPage() {
  useDocumentTitle('Reports')
  const fleet = useMemo(() => getFleet(), [])
  const bookings = useMemo(() => getAllBookings(), [])

  const byStatus = useMemo(() => {
    const map: Record<string, number> = { confirmed: 0, completed: 0, cancelled: 0 }
    bookings.forEach((b) => {
      const s = b.status ?? 'confirmed'
      map[s] = (map[s] ?? 0) + 1
    })
    return map
  }, [bookings])

  const revenueCompleted = useMemo(
    () => bookings.filter((b) => b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0),
    [bookings]
  )

  const fleetByType = useMemo(() => {
    const map: Record<string, number> = {}
    fleet.forEach((c) => {
      map[c.type] = (map[c.type] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [fleet])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-display text-2xl font-bold text-slate-900">Reports</h1>
      <p className="mt-1 text-slate-600">Summary metrics and export</p>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Booking summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Confirmed</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">{byStatus.confirmed ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">{byStatus.completed ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Cancelled</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">{byStatus.cancelled ?? 0}</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Revenue (completed bookings)</h2>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="font-display text-3xl font-bold text-slate-900">${revenueCompleted.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Sum of total price for all completed rentals</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Fleet by type</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-700">Type</th>
                <th className="px-4 py-3 font-medium text-slate-700">Count</th>
              </tr>
            </thead>
            <tbody>
              {fleetByType.map(([type, count]) => (
                <tr key={type} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{CAR_TYPE_LABELS[type] ?? type}</td>
                  <td className="px-4 py-3 text-slate-600">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">Export</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadFleetCsv(fleet)}
            className="inline-flex items-center px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            Export fleet (CSV)
          </button>
          <button
            type="button"
            onClick={() => downloadBookingsCsv(bookings)}
            className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Export bookings (CSV)
          </button>
        </div>
      </section>

      <p className="mt-8">
        <Link to="/admin" className="text-brand-600 font-medium hover:underline">
          ← Back to Admin
        </Link>
      </p>
    </div>
  )
}
