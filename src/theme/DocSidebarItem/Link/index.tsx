import { type ReactNode } from 'react'
import clsx from 'clsx'
import { ThemeClassNames } from '@docusaurus/theme-common'
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client'
import Link from '@docusaurus/Link'
import isInternalUrl from '@docusaurus/isInternalUrl'
import IconExternalLink from '@theme/Icon/ExternalLink'
import type { Props } from '@theme/DocSidebarItem/Link'

import styles from './styles.module.css'

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const { href, label, className, autoAddBaseUrl } = item
  const isActive = isActiveSidebarItem(item, activePath)
  const isInternalLink = isInternalUrl(href)
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        styles.menuListItem,
        {
          [styles.docSidebarItemLinkLevel1]: level === 1,
          [styles.docSidebarItemLinkLevel2]: level === 2,
          [styles.docSidebarItemLinkLevelOther]: level >= 3
        },
        className
      )}
      key={label}
    >
      <Link
        className={clsx(
          'menu__link',
          styles.menuLink,
          { [styles.menuLinkActive]: isActive },
          !isInternalLink && styles.menuExternalLink
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined
        })}
        {...props}
      >
        {item.customProps?.icon && (
          <img src={item.customProps.icon as string} />
        )}
        {label}
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  )
}
