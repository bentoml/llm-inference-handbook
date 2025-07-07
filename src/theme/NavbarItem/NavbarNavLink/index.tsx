import { type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import clsx from 'clsx'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { isRegexpStringMatch } from '@docusaurus/theme-common'
import type { Props } from '@theme/NavbarItem/NavbarNavLink'
import Button from '@site/src/components/Button'

import styles from './styles.module.css'

interface CustomNavbarNavLinkProps extends Props {
  button?: string
  icon?: string
}

function NavbarNavLinkContent({
  html,
  label,
  button,
  icon
}: CustomNavbarNavLinkProps) {
  if (button) return <Button type="button">{label}</Button>
  if (html) return <span dangerouslySetInnerHTML={{ __html: html }} />
  return (
    <span
      className={clsx(styles.navbarNavLinkContent, {
        [styles.navbarNavLinkContentWithIcon]: icon
      })}
    >
      {icon && (
        <div
          className={styles.navbarNavLinkIcon}
          style={{ background: `url(${icon})` }}
        />
      )}
      <span className={styles.navbarNavLinkContentLabel}>{label}</span>
    </span>
  )
}

export default function NavbarNavLink(
  props: CustomNavbarNavLinkProps
): ReactNode {
  const {
    activeBasePath,
    activeBaseRegex,
    to,
    href,
    isDropdownLink,
    prependBaseUrlToHref,
    className,
    ...others
  } = props
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to)
  const activeBaseUrl = useBaseUrl(activeBasePath)
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true })

  if (href) {
    return (
      <Link
        href={prependBaseUrlToHref ? normalizedHref : href}
        className={clsx(className, styles.navbarNavLink)}
        {...others}
      >
        <NavbarNavLinkContent {...props} />
      </Link>
    )
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl)
      })}
      {...others}
    >
      <NavbarNavLinkContent {...props} />
    </Link>
  )
}
