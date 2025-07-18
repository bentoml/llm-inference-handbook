import { useState, useRef, useEffect, useMemo, type ReactNode } from 'react'
import clsx from 'clsx'
import useBaseUrl from '@docusaurus/useBaseUrl'
import NavbarNavLink, { BaseNavLink } from '@theme/NavbarItem/NavbarNavLink'
import NavbarItem from '@theme/NavbarItem'
import type { Props } from '@theme/NavbarItem/DropdownNavbarItem/Desktop'
import styles from './styles.module.css'

export default function DropdownNavbarItemDesktop({
  items,
  position,
  className,
  onClick,
  ...props
}: Props): ReactNode {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const isCardMode = useMemo(() => {
    console.log(
      items.every(
        (item) => item.description && item.label && item.text && item.icon
      )
    )
    return items.every(
      (item) => item.description && item.label && item.text && item.icon
    )
  }, [items])

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | TouchEvent | FocusEvent
    ) => {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(event.target as Node)
      ) {
        return
      }
      setShowDropdown(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('focusin', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('focusin', handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        'navbar__item',
        'dropdown',
        'dropdown--hoverable',
        styles.dropdown,
        {
          'dropdown--right': position === 'right',
          'dropdown--show': showDropdown
        }
      )}
    >
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        // # hash permits to make the <a> tag focusable in case no link target
        // See https://github.com/facebook/docusaurus/pull/6003
        // There's probably a better solution though...
        href={props.to ? undefined : '#'}
        className={clsx('navbar__link', styles.navbarLink, className)}
        hasPopup
        {...props}
        onClick={props.to ? undefined : (e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            setShowDropdown(!showDropdown)
          }
        }}
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul
        className={clsx('dropdown__menu', styles.dropdownMenu, {
          [styles.cardMode]: isCardMode
        })}
      >
        {isCardMode
          ? items.map((childItemProps, i) => (
              <li key={i} className={styles.dropdownItem}>
                <BaseNavLink {...childItemProps}>
                  <i
                    className={styles.dropdownItemIcon}
                    style={{
                      background: `url(${useBaseUrl(childItemProps.icon)})`
                    }}
                  />
                  <p className={styles.dropdownItemLabel}>
                    {childItemProps.label}
                  </p>
                  <p className={styles.dropdownItemDescription}>
                    {childItemProps.description}
                  </p>
                  <p className={styles.dropdownItemText}>
                    {childItemProps.text}
                  </p>
                </BaseNavLink>
              </li>
            ))
          : items.map((childItemProps, i) => (
              <NavbarItem
                isDropdownItem
                className={styles.dropdownItem}
                activeClassName="dropdown__link--active"
                {...childItemProps}
                key={i}
              />
            ))}
      </ul>
    </div>
  )
}
