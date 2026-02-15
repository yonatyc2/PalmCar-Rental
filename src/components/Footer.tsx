import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { user } = useAuth()

  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/palmcar-logo.png" alt="" className="h-8 w-auto" aria-hidden />
            <span className="font-display font-semibold text-slate-900">PalmCar Rental</span>
          </div>
          <p className="text-sm text-slate-600">Smooth drive, fulfilling your desire.</p>
          <nav className="flex items-center gap-6 text-sm" aria-label="Footer">
            <Link to="/cars" className="text-slate-600 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded">
              Fleet
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className="text-slate-600 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded">
                  Admin
                </Link>
                <Link to="/admin/reports" className="text-slate-600 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded">
                  Reports
                </Link>
              </>
            )}
          </nav>
        </div>
        <p className="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          Internal fleet management system. © {new Date().getFullYear()} PalmCar Rental.
        </p>
      </div>
    </footer>
  )
}
