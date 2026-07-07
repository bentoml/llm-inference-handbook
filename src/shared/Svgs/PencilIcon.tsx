import { rem } from '@mantine/core';
import type { JSX } from 'react';

interface PencilIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export function PencilIcon({
  size = 22,
  style,
  fill,
  ...others
}: PencilIconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: rem(size), height: rem(size), ...style }}
      {...others}
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="m5.33 14.67 9.34-9.34-4-4-9.34 9.34v4h4ZM8.33 3.67l4 4" />
      </g>
    </svg>
  );
}
