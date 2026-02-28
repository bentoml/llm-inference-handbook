import { type ReactNode, useState, useCallback } from 'react'
import clsx from 'clsx'
import ErrorBoundary from '@docusaurus/ErrorBoundary'
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames
} from '@docusaurus/theme-common'
import { useKeyboardNavigation } from '@docusaurus/theme-common/internal'
import SkipToContent from '@theme/SkipToContent'
import AnnouncementBar from '@theme/AnnouncementBar'
import Navbar from '@theme/Navbar'
import Footer from '@theme/Footer'
import LayoutProvider from '@theme/Layout/Provider'
import ErrorPageContent from '@theme/ErrorPageContent'
import type { Props } from '@theme/Layout'
import Chat from '@site/src/components/Chat'
import Banner from '@site/src/components/Banner'
import styles from './styles.module.css'

const NAVBAR_HEIGHT_PX = 81
const BANNER_HEIGHT_PX = 44

export default function Layout(props: Props): ReactNode {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description
  } = props

  const [bannerVisible, setBannerVisible] = useState(true)
  const onBannerVisibilityChange = useCallback((visible: boolean) => {
    setBannerVisible(visible)
  }, [])

  useKeyboardNavigation()

  const navbarSpacerHeight =
    bannerVisible ? BANNER_HEIGHT_PX + NAVBAR_HEIGHT_PX : NAVBAR_HEIGHT_PX

  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <div className={styles.navbarWrapper}>
        <Banner onVisibilityChange={onBannerVisibilityChange} />
        <Navbar />
      </div>
      <div
        className={styles.navbarSpacer}
        style={{ height: navbarSpacerHeight }}
        aria-hidden
      />

      <AnnouncementBar />

      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.layout.main.container,
          ThemeClassNames.wrapper.main,
          wrapperClassName
        )}
      >
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>

      <Chat />

      {!noFooter && <Footer />}
    </LayoutProvider>
  )
}
