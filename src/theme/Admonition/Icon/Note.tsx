import type { ReactNode } from 'react';
import type { Props } from '@theme/Admonition/Icon/Note';
import { NoteIcon } from '@site/dls/icons';

export default function AdmonitionIconNote(props: Props): ReactNode {
  return <NoteIcon size={20} {...props} />;
}
