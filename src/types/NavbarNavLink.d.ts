declare module '@theme/NavbarItem/NavbarNavLink' {
  import type { Props as NavbarNavLinkProps } from '@theme/NavbarItem/NavbarNavLink'

  export interface Props extends NavbarNavLinkProps {
    button?: string
    icon?: string
    text?: string
    description?: string
    hasPopup?: boolean
  }

  export function BaseNavLink(props: Props): ReactNode
}
