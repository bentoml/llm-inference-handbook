import React, { type ReactNode } from 'react';
import { Alert, Box } from '@mantine/core';
import clsx from 'clsx';

import type { Props } from '@theme/Admonition/Layout';
import styles from './styles.module.scss';
import IconDanger from '@theme/Admonition/Icon/Danger';
import IconWarning from '@theme/Admonition/Icon/Warning';
import IconTip from '@theme/Admonition/Icon/Tip';
import IconNote from '@theme/Admonition/Icon/Note';
import IconExperiment from '@theme/Admonition/Icon/Experiment';
import { ThumbsUp } from '@site/dls/icons';

const typeToColor = {
  note: 'neutral-blue',
  info: 'neutral-blue',
  tip: 'neutral-blue',
  caution: 'warning',
  warning: 'danger',
  danger: 'danger',
  success: 'success',
  experiment: 'warning',
};

const typeToIcon = {
  success: <ThumbsUp />,
  caution: <IconWarning />,
  danger: <IconDanger />,
  warning: <IconDanger />,
  info: <IconNote />,
  tip: <IconTip />,
  note: <IconNote />,
  experiment: <IconExperiment />,
};

const noPlaceholderTypes = ['note', 'tip', 'info'];

// Only use placeholder title for types not in the above list
// But if custom title is supplied, always render it
function renderTitle(
  title: ReactNode,
  type: string
): string | React.ReactElement | undefined {
  if (typeof title === 'string') return title;
  if (!title || noPlaceholderTypes.includes(type)) return undefined;
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function AdmonitionLayout(props: Props): ReactNode {
  const { type: rawType, title, children, className } = props;
  const type = rawType in typeToColor ? rawType : 'note';
  return (
    <Alert
      color={typeToColor[type]}
      icon={typeToIcon[type] ?? <IconNote />}
      title={renderTitle(title, type)}
      className={clsx(styles.admonitionAlertRoot, 'my-6', className)}
      aria-label={type}
      data-admonition-type={type}
    >
      <Box className={styles.admonitionAlertContent}>{children}</Box>
    </Alert>
  );
}
