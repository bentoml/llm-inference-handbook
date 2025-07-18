import { type ReactNode, useState, useCallback, Fragment } from 'react'
import clsx from 'clsx'
import {
  prefersReducedMotion,
  ThemeClassNames,
  useThemeConfig
} from '@docusaurus/theme-common'
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client'
import { useLocation } from '@docusaurus/router'
import Logo from '@theme/Logo'
import DocSidebar from '@theme/DocSidebar'
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton'
import type { Props } from '@theme/DocRoot/Layout/Sidebar'

import styles from './styles.module.css'

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({ children }: { children: ReactNode }) {
  const sidebar = useDocsSidebar()
  return <Fragment key={sidebar?.name ?? 'noSidebar'}>{children}</Fragment>
}

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer
}: Props): ReactNode {
  const { pathname } = useLocation()
  const {
    navbar: { hideOnScroll }
  } = useThemeConfig()
  const [hiddenSidebar, setHiddenSidebar] = useState(false)
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false)
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true)
    }
    setHiddenSidebarContainer((value) => !value)
  }, [setHiddenSidebarContainer, hiddenSidebar])

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
        { [styles.docSidebarHideOnScrollOffset]: hideOnScroll }
      )}
      onTransitionEnd={(e) => {
        if (!e.currentTarget.classList.contains(styles.docSidebarContainer!)) {
          return
        }

        if (hiddenSidebarContainer) {
          setHiddenSidebar(true)
        }
      }}
    >
      {hideOnScroll && (
        <div className={styles.sidebarHeader}>
          <Logo tabIndex={-1} className={styles.sidebarLogo} />
        </div>
      )}
      <ResetOnSidebarChange>
        <div
          className={clsx(
            styles.sidebarViewport,
            hiddenSidebar && styles.sidebarViewportHidden
          )}
        >
          <DocSidebar
            sidebar={sidebar}
            path={pathname}
            onCollapse={toggleSidebar}
            isHidden={hiddenSidebar}
          />
          {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
        </div>
      </ResetOnSidebarChange>
    </aside>
  )
}
