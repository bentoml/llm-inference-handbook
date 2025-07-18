import { type ReactNode } from 'react'
import Link from '@docusaurus/Link'
import clsx from 'clsx'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { isRegexpStringMatch } from '@docusaurus/theme-common'
import type { Props } from '@theme/NavbarItem/NavbarNavLink'
import Button from '@site/src/components/Button'

import styles from './styles.module.css'

function NavbarNavLinkContent({ html, label, button, icon, hasPopup }: Props) {
  if (button) return <Button type="button">{label}</Button>
  if (html) return <span dangerouslySetInnerHTML={{ __html: html }} />
  return (
    <span
      className={clsx(styles.navbarNavLinkContent, {
        [styles.navbarNavLinkContentWithIcon]: icon
      })}
    >
      {icon && (
        <i
          className={styles.navbarNavLinkIcon}
          style={{ background: `url(${useBaseUrl(icon)})` }}
        />
      )}
      <span className={styles.navbarNavLinkContentLabel}>
        {label}
        {hasPopup && (
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 24 24"
            className={styles.hasPopupIcon}
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        )}
      </span>
    </span>
  )
}

export function BaseNavLink(props: Props) {
  const {
    activeBasePath,
    activeBaseRegex,
    to,
    href,
    prependBaseUrlToHref,
    className,
    children,
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
        {children}
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
      {children}
    </Link>
  )
}

export default function NavbarNavLink(props: Props): ReactNode {
  return (
    <BaseNavLink {...props}>
      <NavbarNavLinkContent {...props} />
    </BaseNavLink>
  )
}
