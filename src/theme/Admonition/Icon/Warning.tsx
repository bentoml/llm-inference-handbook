import type { ReactNode } from 'react';
import type { Props } from '@theme/Admonition/Icon/Warning';
import { CautionOctagon } from '@site/dls/icons';

export default function AdmonitionIconCaution(props: Props): ReactNode {
  return <CautionOctagon size={20} {...props} />;
}
