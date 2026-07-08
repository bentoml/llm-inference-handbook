import React from 'react';
import Link from '@docusaurus/Link';
import { PencilIcon } from '@site/src/shared/Svgs/PencilIcon';

export default function DocActions({ editUrl }: { editUrl?: string }) {
  if (!editUrl) {
    return null;
  }

  return (
    <Link to={editUrl} className="theme-edit-this-page">
      <PencilIcon size={14} />
      Edit this page
    </Link>
  );
}
