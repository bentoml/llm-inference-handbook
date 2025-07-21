import React, { type ReactNode } from 'react'
import DropdownNavbarItemMobile from '@theme/NavbarItem/DropdownNavbarItem/Mobile'
import DropdownNavbarItemDesktop from '@theme/NavbarItem/DropdownNavbarItem/Desktop'
import type { Props } from '@theme/NavbarItem/DropdownNavbarItem'

export default function DropdownNavbarItem({
  mobile = false,
  ...props
}: Props): ReactNode {
  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop
  return <Comp {...props} />
}
