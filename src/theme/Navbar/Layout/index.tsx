import { type ComponentProps, type ReactNode } from 'react'
import clsx from 'clsx'
import { ThemeClassNames, useThemeConfig } from '@docusaurus/theme-common'
import {
  useHideableNavbar,
  useNavbarMobileSidebar
} from '@docusaurus/theme-common/internal'
import { translate } from '@docusaurus/Translate'
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar'
import type { Props } from '@theme/Navbar/Layout'

import styles from './styles.module.css'

function NavbarBackdrop(props: ComponentProps<'div'>) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx('navbar-sidebar__backdrop', props.className)}
    />
  )
}

export default function NavbarLayout({ children }: Props): ReactNode {
  const {
    navbar: { hideOnScroll, style }
  } = useThemeConfig()
  const mobileSidebar = useNavbarMobileSidebar()
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll)
  return (
    <nav
      ref={navbarRef}
      aria-label={translate({
        id: 'theme.NavBar.navAriaLabel',
        message: 'Main',
        description: 'The ARIA label for the main navigation'
      })}
      className={clsx(
        ThemeClassNames.layout.navbar.container,
        'navbar',
        'navbar--fixed-top',
        styles.navbar,
        hideOnScroll && [
          styles.navbarHideable,
          !isNavbarVisible && styles.navbarHidden
        ],
        {
          'navbar--dark': style === 'dark',
          'navbar--primary': style === 'primary',
          'navbar-sidebar--show': mobileSidebar.shown
        }
      )}
    >
      <div className={styles.navbarInner}>
        <div className={styles.navbarContent}>{children}</div>
      </div>
      <NavbarBackdrop onClick={mobileSidebar.toggle} />
      <NavbarMobileSidebar />
    </nav>
  )
}
