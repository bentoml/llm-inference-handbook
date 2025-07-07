import { type ReactNode } from 'react'
import type { Props } from '@theme/Icon/Close'

export default function IconClose({
  width = 21,
  height = 21,
  color = 'currentColor',
  strokeWidth = 1.2,
  className,
  ...restProps
}: Props): ReactNode {
  return (
    <svg
      fill={color}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      className={className}
      width={width}
      height={height}
      {...restProps}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}
