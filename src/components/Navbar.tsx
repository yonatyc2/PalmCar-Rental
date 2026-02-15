import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks: { label: string; to?: string; href?: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'Fleet', to: '/cars' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/palmcar-logo.png" alt="PalmCar Rental" className="h-9 w-auto" />
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight hidden sm:inline">
            PalmCar Rental
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.to ? (
                <Link
                  to={link.to}
                  className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ) : link.href ? (
                <a
                  href={link.href}
                  className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ) : null}
            </li>
          ))}
          {user && (
            <>
              <li>
                <Link to="/bookings" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                  My bookings
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                  Profile
                </Link>
              </li>
              {user.role === 'admin' && (
                <>
                  <li>
                    <Link to="/admin" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/reports" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                      Reports
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {!isLoading && (
            user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
                >
                  Book now
                </Link>
              </>
            )
          )}
          {user && (
            <Link
              to="/cars"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              Book now
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link
                    to={link.to}
                    className="block py-2 text-slate-600 hover:text-brand-600 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : link.href ? (
                  <a
                    href={link.href}
                    className="block py-2 text-slate-600 hover:text-brand-600 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : null}
              </li>
            ))}
            {user && (
              <>
                <li>
                  <Link to="/bookings" className="block py-2 text-slate-600 hover:text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>
                    My bookings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="block py-2 text-slate-600 hover:text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>
                    Profile
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <>
                    <li>
                      <Link to="/admin" className="block py-2 text-slate-600 hover:text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>
                        Admin
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/reports" className="block py-2 text-slate-600 hover:text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>
                        Reports
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
            <li className="pt-2 flex gap-2">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex-1 text-center py-3 rounded-lg border border-slate-300 text-slate-700 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              )}
              <Link
                to="/cars"
                className="flex-1 text-center py-3 rounded-lg bg-brand-600 text-white font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Book now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
