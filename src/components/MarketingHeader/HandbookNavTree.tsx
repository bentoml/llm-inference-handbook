import React, { useMemo, useState } from 'react';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import type {
  PropSidebar,
  PropSidebarItem,
  PropSidebarItemCategory,
} from '@docusaurus/plugin-content-docs';

type Props = {
  sidebar: PropSidebar;
  activePath: string;
  onNavigate?: () => void;
};

function isCategory(
  item: PropSidebarItem
): item is PropSidebarItemCategory {
  return item.type === 'category';
}

function sidebarItemKey(item: PropSidebarItem, index: number): string {
  if (item.type === 'category') return item.label;
  if (item.type === 'link') return item.href;
  return `html-${index}`;
}

function CategoryItem({
  category,
  activePath,
  onNavigate,
}: {
  category: PropSidebarItemCategory;
  activePath: string;
  onNavigate?: () => void;
}): JSX.Element {
  const [expanded, setExpanded] = useState(
    () => !category.collapsed || isActiveSidebarItem(category, activePath)
  );

  return (
    <div className={`mh-toc-category${expanded ? ' expanded' : ''}`}>
      <button
        type="button"
        className="mh-toc-category-header"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span>{category.label}</span>
        <svg className="mh-chevron" viewBox="0 0 7 7" fill="none" aria-hidden="true">
          <path d="M0.5 3L3.5 6L6.5 3" stroke="currentColor" />
        </svg>
      </button>
      <div className="mh-toc-category-items">
        {category.items.map((item, index) => (
          <SidebarItem
            key={sidebarItemKey(item, index)}
            item={item}
            activePath={activePath}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({
  item,
  activePath,
  onNavigate,
}: {
  item: PropSidebarItem;
  activePath: string;
  onNavigate?: () => void;
}): JSX.Element | null {
  if (isCategory(item)) {
    return (
      <CategoryItem
        category={item}
        activePath={activePath}
        onNavigate={onNavigate}
      />
    );
  }

  if (item.type === 'link') {
    const current = isActiveSidebarItem(item, activePath);
    return (
      <a
        className={`mh-toc-article${current ? ' current' : ''}`}
        href={item.href}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }

  return null;
}

export default function HandbookNavTree({
  sidebar,
  activePath,
  onNavigate,
}: Props): JSX.Element {
  const { topLinks, categories } = useMemo(() => {
    const links: PropSidebarItem[] = [];
    const cats: PropSidebarItemCategory[] = [];
    sidebar.forEach((item) => {
      if (isCategory(item)) {
        cats.push(item);
      } else if (item.type === 'link' && item.className !== 'hidden') {
        // Docusaurus auto-adds a second, intentionally hidden link to the
        // intro doc alongside the configured "Welcome" link; skip it here
        // the same way the default sidebar hides it via CSS.
        links.push(item);
      }
    });
    return { topLinks: links, categories: cats };
  }, [sidebar]);

  if (sidebar.length === 0) {
    return <p className="mh-toc-empty">No handbook chapters found.</p>;
  }

  return (
    <div>
      {topLinks.map((item) =>
        item.type === 'link' ? (
          <a
            key={item.href}
            className={`mh-toc-welcome${isActiveSidebarItem(item, activePath) ? ' current' : ''}`}
            href={item.href}
            onClick={onNavigate}
          >
            {item.label}
          </a>
        ) : null
      )}
      {categories.map((category) => (
        <CategoryItem
          key={category.label}
          category={category}
          activePath={activePath}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
