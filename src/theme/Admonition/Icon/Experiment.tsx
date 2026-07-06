import type { ReactNode } from 'react';
import type { Props } from '@theme/Admonition/Icon/Experiment';
import { ExperimentIcon } from '@site/dls/icons';

export default function AdmonitionIconExperiment(props: Props): ReactNode {
  return <ExperimentIcon size={20} {...props} />;
}
