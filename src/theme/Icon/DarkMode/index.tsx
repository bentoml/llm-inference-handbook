import type { ReactNode } from 'react';
import type { Props } from '@theme/Icon/DarkMode';
import { MoonIcon } from '@site/dls/icons';

export default function IconDarkMode(props: Props): ReactNode {
  return <MoonIcon size={22} {...props} />;
}
