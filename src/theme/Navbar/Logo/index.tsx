import { type ReactNode } from 'react'
import Logo from '@theme/Logo'
import styles from './styles.module.css'

export default function NavbarLogo(): ReactNode {
  return (
    <Logo
      target="_self"
      imageClassName={styles.navbarLogo}
      titleClassName="navbar__title text--truncate"
    />
  )
}
