import React from 'react';
import { SimpleGrid } from '@mantine/core';
import RequestDemo from '@site/src/components/RequestDemo';
import { NewsletterSignupForm } from '@site/src/components/NewsletterSignupForm';

export default function ContactSection() {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      <NewsletterSignupForm
        className="grid-cols-1"
        returnUrl="https://handbook.modular.com/"
      />
      <RequestDemo className="h-full grid-cols-1" />
    </SimpleGrid>
  );
}
