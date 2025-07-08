import { memo } from 'react'
import clsx from 'clsx'
import { useThemeConfig } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Link from '@docusaurus/Link'
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton'
import Content from '@theme/DocSidebar/Desktop/Content'
import type { Props } from '@theme/DocSidebar/Desktop'

import styles from './styles.module.css'

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props) {
  const {
    navbar: { hideOnScroll },
    docs: {
      sidebar: { hideable }
    }
  } = useThemeConfig()
  const {
    siteConfig: { title }
  } = useDocusaurusContext()

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden
      )}
    >
      <div className={styles.sidebarHeader}>
        <h2>
          <Link href="/">{title}</Link>
        </h2>
      </div>
      <Content path={path} sidebar={sidebar} />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  )
}

export default memo(DocSidebarDesktop)
