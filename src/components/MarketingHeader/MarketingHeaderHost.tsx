import React, { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import MarketingHeader from './MarketingHeader';
import headerStyles from './styles';

export default function MarketingHeaderHost(): JSX.Element {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    setShadowRoot(root);

    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = headerStyles;
      root.appendChild(style);
      styleRef.current = style;
    }

    let mount = root.querySelector<HTMLDivElement>(
      '[data-marketing-header-root]'
    );
    if (!mount) {
      mount = document.createElement('div');
      mount.setAttribute('data-marketing-header-root', '');
      root.appendChild(mount);
    }

    if (!rootRef.current) {
      rootRef.current = createRoot(mount);
    }

    return () => {
      rootRef.current?.unmount();
      rootRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || !shadowRoot) return;
    rootRef.current.render(<MarketingHeader shadowRoot={shadowRoot} />);
  }, [shadowRoot]);

  return (
    <div
      ref={hostRef}
      className="navbar"
      data-marketing-header-host
      style={{
        display: 'block',
        padding: 0,
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}
    />
  );
}
