import { type ReactNode } from 'react'
import type { Props } from '@theme/Icon/Menu'

export default function IconMenu({
  width = 32,
  height = 32,
  className,
  ...restProps
}: Props): ReactNode {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      width={width}
      height={height}
      {...restProps}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  )
}
