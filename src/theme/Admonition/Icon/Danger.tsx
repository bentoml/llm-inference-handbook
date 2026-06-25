import type { ReactNode } from 'react';
import type { Props } from '@theme/Admonition/Icon/Danger';
import { DangerTriangleIcon } from '@site/dls/icons';

export default function AdmonitionIconDanger(
  props: Props & { size?: number | string }
): ReactNode {
  return <DangerTriangleIcon size={props.size ?? 20} {...props} />;
}
