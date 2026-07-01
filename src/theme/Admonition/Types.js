import React from 'react';
import clsx from 'clsx';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import AdmonitionLayout from '@theme/Admonition/Layout';

const experimentClassName = 'alert alert--experiment';

function ExperimentAdmonition(props) {
  return (
    <AdmonitionLayout
      {...props}
      type="experiment"
      className={clsx(experimentClassName, props.className)}
    >
      {props.children}
    </AdmonitionLayout>
  );
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  experiment: ExperimentAdmonition,
};

export default AdmonitionTypes;
