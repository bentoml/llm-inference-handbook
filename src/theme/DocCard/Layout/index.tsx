import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { ThemeClassNames } from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';

type Props = {
  className?: string;
  href: string;
  title: string;
  description?: string;
};

export default function DocCardLayout({
  className,
  href,
  title,
  description,
}: Props): JSX.Element {
  return (
    <Link
      href={href}
      className={clsx(
        'card',
        ThemeClassNames.docs.docCard.container,
        styles.cardContainer,
        className
      )}
    >
      <Heading
        as="h2"
        className={clsx(ThemeClassNames.docs.docCard.heading, styles.cardTitle)}
        title={title}
      >
        <span className={styles.cardTitleLink}>{title}</span>
      </Heading>
      {description ? (
        <p
          className={clsx(
            ThemeClassNames.docs.docCard.description,
            styles.cardDescription
          )}
          title={description}
        >
          {description}
        </p>
      ) : null}
    </Link>
  );
}
