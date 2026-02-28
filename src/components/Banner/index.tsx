import { useState, useEffect } from 'react'
import styles from './styles.module.css'

const BANNER_STORAGE_KEY = 'handbook-banner-dismissed'

type BannerProps = {
  onVisibilityChange?: (visible: boolean) => void
}

export default function Banner({ onVisibilityChange }: BannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(BANNER_STORAGE_KEY)
      const isVisible = dismissed !== 'true'
      setVisible(isVisible)
      onVisibilityChange?.(isVisible)
    } catch {
      setVisible(true)
      onVisibilityChange?.(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
  }, [])

  const handleClose = () => {
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, 'true')
      setVisible(false)
      onVisibilityChange?.(false)
    } catch {
      setVisible(false)
      onVisibilityChange?.(false)
    }
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="banner">
      📢{' '}
      <a
        className={styles.bannerLink}
        href="https://www.bentoml.com/blog/bentoml-is-joining-modular"
        target="_self"
        rel="noopener noreferrer"
      >
        BentoML joins Modular
      </a>{' '}
      to build a complete stack for production AI inference.
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Dismiss banner"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  )
}
