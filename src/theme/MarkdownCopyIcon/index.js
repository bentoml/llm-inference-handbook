import React from 'react';
import IconCopy from '@theme/Icon/Copy';

/* Override the default copy icon in markdown_docusaurus_plugin */
export default function MarkdownCopyIconOverride({ size, style }) {
  return <IconCopy style={{ width: 14, height: 14, ...style }} />;
}
