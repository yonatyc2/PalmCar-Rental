import { useEffect } from 'react'

const APP_TITLE = 'PalmCar Rental'

/**
 * Sets document.title for the current page. Resets to default on unmount.
 */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | ${APP_TITLE}` : APP_TITLE
    return () => {
      document.title = previous
    }
  }, [title])
}
