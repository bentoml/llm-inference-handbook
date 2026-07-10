import React, { type ReactNode } from 'react';
import Content from '@theme-original/DocItem/Content';
import LlmsDirective from '@theme/LlmsDirective';
import type { Props } from '@theme/DocItem/Content';

export default function DocItemContentWrapper(props: Props): ReactNode {
  return (
    <>
      <LlmsDirective />
      <Content {...props} />
    </>
  );
}
