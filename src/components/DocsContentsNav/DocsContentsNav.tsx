import React, { isValidElement, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal';
import type { PropSidebar } from '@docusaurus/plugin-content-docs';
import HandbookNavTree from '../MarketingHeader/HandbookNavTree';
import styles from './styles.module.scss';

// The docs sidebar tree isn't reachable via React Context from here (see
// HandbookNavTree's original home in MarketingHeaderHost), so we borrow it
// from the secondary-menu "teleport" that Docusaurus's own default
// `@theme/DocSidebar/Mobile` already feeds on every doc page, and read its
// raw props instead of rendering its (Infima-styled) element.
type SecondaryMenuProps = { sidebar?: PropSidebar; path?: string };

function useHandbookSidebarData(): { sidebar?: PropSidebar; activePath?: string } {
  const { content } = useNavbarSecondaryMenu();
  return useMemo(() => {
    if (!isValidElement(content)) {
      return {};
    }
    const props = content.props as SecondaryMenuProps;
    return { sidebar: props.sidebar, activePath: props.path };
  }, [content]);
}

export default function DocsContentsNav(): JSX.Element | null {
  const { sidebar, activePath } = useHandbookSidebarData();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!sidebar || sidebar.length === 0) {
    return null;
  }

  return (
    <div className={styles.subbar}>
      {/* The page's own breadcrumb trail already renders right below this bar
          (see DocBreadcrumbs in DocItem/Layout) — repeating it here just
          duplicated it, so this side is a plain, static label instead. */}
      <span className={styles.crumb}>LLM Inference Handbook</span>
      <button
        type="button"
        className={styles.contentsBtn}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <ContentsIcon />
        Contents
      </button>

      {open
        ? createPortal(
            <div className={styles.overlay} role="dialog" aria-label="LLM Inference Handbook">
              <div className={styles.overlayHeader}>
                <span className={styles.overlayTitle}>LLM Inference Handbook</span>
                <button
                  type="button"
                  className={styles.closeBtn}
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className={styles.overlayBody}>
                <HandbookNavTree
                  sidebar={sidebar}
                  activePath={activePath ?? ''}
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function ContentsIcon(): JSX.Element {
  return (
    <svg
      className={styles.contentsIcon}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3.33301 5.83333H16.6663" stroke="currentColor" />
      <path d="M3.33301 10H16.6663" stroke="currentColor" />
      <path d="M3.33301 14.1667H11.6663" stroke="currentColor" />
    </svg>
  );
}

function CloseIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.5 4.5L15.5 15.5" stroke="currentColor" />
      <path d="M15.5 4.5L4.5 15.5" stroke="currentColor" />
    </svg>
  );
}
