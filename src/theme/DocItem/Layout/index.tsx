import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import DocActions from '@site/src/components/DocActions';
import type { Props } from '@theme/DocItem/Layout';
import styles from './styles.module.scss';

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  return {
    hidden,
    mobile: canRender ? <DocItemTOCMobile /> : undefined,
    desktop:
      canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
        <DocItemTOCDesktop />
      ) : undefined,
  };
}

export default function DocItemLayout({ children }: Props): ReactNode {
  const {
    metadata: { editUrl },
  } = useDoc();
  const docTOC = useDocTOC();
  const showRightRail = Boolean(editUrl) || !docTOC.hidden;

  return (
    <div className={clsx('row', showRightRail && styles.docItemRow)}>
      <div className={clsx('col', styles.docItemCol)}>
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {showRightRail && (
        <div className={clsx('col col--3 !mx-0', styles.rightRailCol)}>
          <div className={clsx(styles.rightRail, 'thin-scrollbar')}>
            <div className="doc-actions">
              <DocActions editUrl={editUrl} />
            </div>
            {docTOC.desktop}
          </div>
        </div>
      )}
    </div>
  );
}
