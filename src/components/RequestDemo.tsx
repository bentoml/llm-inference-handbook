import React from 'react';
import { Title, Stack, rem, Button, Text } from '@mantine/core';
import Link from '@docusaurus/Link';
import analyticsTracker from '@site/dls/analyticsTracker';
import clsx from 'clsx';

export default function RequestDemo({ className }: { className: string }) {
  return (
    <Stack
      justify="space-between"
      style={{
        border: '1px solid var(--Elements-Twilight-20-70)',
        borderRadius: '4px',
        padding: '1.5rem',
      }}
      className={clsx('min-h-[216px]', className)}
    >
      <Stack gap={0} maw={rem(360)} className="contact-form-heading">
        <Title order={4}>
          <Text component="span" fw={400} fz={rem(24)} lh={rem(32)}>
            Talk to an AI Expert
          </Text>
        </Title>
        <Text fz={rem(14)} lh={rem(24)} c="var(--Elements-Twilight-70-20)">
          Connect with our product experts to explore how we can help you deploy
          and serve AI models with high performance, scalability, and
          cost-efficiency.
        </Text>
      </Stack>
      <Button
        component={Link}
        href="https://www.modular.com/request-demo"
        className="mb-[18px]"
        fullWidth
        m={0}
        target="_blank"
        onClick={() => {
          analyticsTracker.track('RequestDemoClicked');
        }}
      >
        Request a demo
      </Button>
    </Stack>
  );
}
