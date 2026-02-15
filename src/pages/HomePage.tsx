import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Hero from '../components/Hero'
import CarSearchForm from '../components/CarSearchForm'
import { getFleet } from '../lib/fleet'
import { getAllBookings } from '../lib/bookings'

function DashboardStats() {
  const { user } = useAuth()
  const fleet = getFleet()
  const bookings = getAllBookings()
  const active = bookings.filter((b) => b.status !== 'cancelled')
  const upcoming = active.filter((b) => b.pickupDate >= new Date().toISOString().slice(0, 10))

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="font-display text-xl font-semibold text-slate-900 mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/cars"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all"
        >
          <p className="text-sm font-medium text-slate-500">Fleet size</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">{fleet.length}</p>
          <p className="mt-1 text-sm text-brand-600 font-medium">View fleet →</p>
        </Link>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total bookings</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">{active.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Upcoming rentals</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">{upcoming.length}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/cars"
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
        >
          View fleet
        </Link>
        <Link
          to="/cars"
          className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          New rental
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Admin
          </Link>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  useDocumentTitle('Home')
  return (
    <>
      <Hero />
      <DashboardStats />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 relative z-10 pb-12">
        <CarSearchForm />
      </section>
    </>
  )
}
