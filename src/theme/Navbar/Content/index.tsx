import { type ReactNode } from 'react'
import { useThemeConfig, ErrorCauseBoundary } from '@docusaurus/theme-common'
import {
  splitNavbarItems,
  useNavbarMobileSidebar
} from '@docusaurus/theme-common/internal'
import NavbarItem, { type Props as NavbarItemConfig } from '@theme/NavbarItem'
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle'
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle'
import NavbarLogo from '@theme/Navbar/Logo'

import styles from './styles.module.css'

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[]
}

function NavbarItems({ items }: { items: NavbarItemConfig[] }): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error }
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  )
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar()
  const items = useNavbarItems()
  const [leftItems, rightItems] = splitNavbarItems(items)

  return (
    <div className={styles.navbarInner}>
      <NavbarLogo />
      <div className={styles.navbarLeftItems}>
        <NavbarItems items={leftItems} />
      </div>
      <div className={styles.navbarRightItems}>
        <NavbarItems items={rightItems} />
        <NavbarColorModeToggle />
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
      </div>
    </div>
  )
}
