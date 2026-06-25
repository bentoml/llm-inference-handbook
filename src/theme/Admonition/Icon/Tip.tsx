import type { ReactNode } from 'react';
import type { Props } from '@theme/Admonition/Icon/Tip';
import { LightbulbIcon } from '@site/dls/icons';

export default function AdmonitionIconTip(props: Props): ReactNode {
  return <LightbulbIcon size={20} {...props} />;
}
