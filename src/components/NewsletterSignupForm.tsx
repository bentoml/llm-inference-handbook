import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { TextInput, Button, Stack, Box, Text } from '@mantine/core';
import { useColorMode } from '@docusaurus/theme-common';

const BLOCKED_DOMAINS = [
  'comcast.net',
  'gmail.com',
  'live.com',
  'yahoo.com',
  'hotmail.com',
  'mail.ru',
  'web.de',
  'gmx.net',
  'live.net',
  'mail.com',
  'aol.com',
  'msn.com',
  'outlook.com',
  'proton.me',
  'protonmail.com',
  'icloud.com',
  'me.com',
  'zoho.com',
  'yandex.com',
  'inbox.com',
];

function isBlockedEmailDomain(email: string): string | null {
  if (!email || !email.includes('@')) return null;
  const domain = email.toLowerCase().split('@')[1];
  return BLOCKED_DOMAINS.includes(domain) ? domain : null;
}

function isLikelyInvalidName(name: string): boolean {
  let score = 0;

  // check for too many consecutive characters
  if (/(.)\1{2,}/.test(name)) score += 3;

  const vowels = name.match(/[aeiou]/gi) || [];
  const vowelRatio = vowels.length / name.replace(/\s/g, '').length;
  // check for too few or too many vowels
  if (vowelRatio < 0.15 || vowelRatio > 0.7) score += 2;

  // check for common keyboard patterns
  if (/asdf|qwer|zxcv|hjkl/i.test(name)) score += 3;

  // check for too many consecutive consonants
  if (/[^aeiou\s]{6,}/i.test(name)) score += 2;

  // check for invalid symbols, include all letters with diacritics
  if (
    /[^a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿāăąćčďđēėęěğģīįķĺļľłńņňőœŕřśşšţťũūůűųźżžșțə\s'-]/i.test(
      name
    )
  )
    score += 3;

  const capsScore = checkCapitalization(name);
  score += capsScore;

  return score >= 3;
}

function checkCapitalization(name: string): number {
  const words = name.split(/[\s-]+/);

  let suspiciousPatterns = 0;

  for (const word of words) {
    if (word.length === 0) continue;

    // check for 3+ consecutive capital letters
    if (/[A-Z]{3,}/.test(word)) {
      suspiciousPatterns += 2;
    }

    // check for suspicious case transitions
    if (word.length > 2) {
      const isException = /^(ma?c|o'|d'|de|van|von|la|le|di|da)[A-Z]/i.test(
        word
      );
      if (isException) {
        return suspiciousPatterns;
      }

      const startsWithLowerCase = /^[a-z]/.test(word);

      let transitions = 0;
      for (let i = 1; i < word.length; i++) {
        const prevIsUpper = /[A-Z]/.test(word[i - 1]);
        const currIsUpper = /[A-Z]/.test(word[i]);
        if (prevIsUpper !== currIsUpper) {
          transitions++;
        }
      }

      if (startsWithLowerCase && transitions > 0) {
        suspiciousPatterns += 3;
      } else if (!startsWithLowerCase && transitions > 2) {
        suspiciousPatterns += 3;
      }
    }
  }

  if (suspiciousPatterns >= 2) return 3;
  if (suspiciousPatterns === 1) return 1;
  return 0;
}

const invalidNameErrorString =
  'Please enter a valid name. Names should contain standard letters and spacing.';

export function NewsletterSignupForm({
  className,
  returnUrl,
}: {
  className?: string;
  returnUrl?: string;
}) {
  const [nameFirstNameError, setNameFirstNameError] = useState<string | null>(
    null
  );
  const [nameLastNameError, setNameLastNameError] = useState<string | null>(
    null
  );
  const [description, setDescription] = useState<string | null>(null);
  const [didSubmit, setDidSubmit] = useState(false);
  const [isDebugSubmittedPreview, setIsDebugSubmittedPreview] = useState(false);
  const { colorMode } = useColorMode();
  const showSubmittedState = didSubmit || isDebugSubmittedPreview;
  const isSubmitDisabled =
    nameLastNameError || nameFirstNameError || description;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    setIsDebugSubmittedPreview(searchParams.has('showNewsletterSubmitted'));
  }, []);

  const handleFieldValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'first_name' | 'last_name'
  ) => {
    const value = e.target.value.trim();
    if (isLikelyInvalidName(value)) {
      fieldName === 'first_name'
        ? setNameFirstNameError(invalidNameErrorString)
        : setNameLastNameError(invalidNameErrorString);
    } else {
      fieldName === 'first_name'
        ? setNameFirstNameError(null)
        : setNameLastNameError(null);
    }
  };

  const handleSubmit = () => {
    setDidSubmit(true);
  };

  return (
    <Box
      component="form"
      className={clsx('salesforce-form', className)}
      style={{
        border: '1px solid var(--Elements-Twilight-20-70)',
        borderRadius: '4px',
        padding: '1.5rem',
      }}
      id="signupForNewsletter"
      w="100%"
      m="0 auto"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="oid" value="00Da500001MRD5G" />
      <input type="hidden" name="retURL" value={returnUrl} />
      <input
        type="hidden"
        name="Lead_Source_Detail__c"
        value="DocsQuickstart"
      />

      <Stack mb="sm" gap="lg">
        <Text unstyled p={0} m={0} className="body-24-light">
          {showSubmittedState
            ? 'Thanks for signing up!'
            : 'Get the latest updates'}
        </Text>
        {!showSubmittedState && (
          <Text
            unstyled
            p={0}
            m={0}
            className="body-14-light"
            c="var(--Elements-Twilight-70-20)"
          >
            Stay up to date on Modular’s updates and key feature releases. We’re
            moving fast over here.
          </Text>
        )}
      </Stack>

      <div style={{ position: 'relative' }}>
        <Stack
          gap="xs"
          style={showSubmittedState ? { visibility: 'hidden' } : undefined}
        >
          <TextInput
            id="newsletter-email"
            name="Newsletter-Email"
            type="email"
            placeholder="Work Email*"
            maxLength={80}
            required
            disabled={showSubmittedState}
            className="emailCheck"
          />
          <TextInput
            id="newsletter-first-name"
            name="Newsletter-First-Name"
            placeholder="First Name*"
            maxLength={40}
            required
            disabled={showSubmittedState}
            onChange={(e) => handleFieldValueChange(e, 'first_name')}
            error={nameFirstNameError}
          />
          <TextInput
            id="newsletter-last-name"
            name="Newsletter-Last-Name"
            placeholder="Last Name*"
            maxLength={80}
            required
            disabled={showSubmittedState}
            onChange={(e) => handleFieldValueChange(e, 'last_name')}
            error={nameLastNameError}
          />
          <TextInput
            id="form-description"
            name="Newsletter-Description"
            placeholder="Description"
            maxLength={200}
            onChange={(e) => setDescription(e.target.value)}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />

          <Button
            type="submit"
            disabled={!!isSubmitDisabled || showSubmittedState}
            fullWidth
          >
            Sign Up
          </Button>
        </Stack>

        {showSubmittedState && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              src={
                colorMode === 'dark'
                  ? '/videos/B-MAX-PaperPlane-Loop.webm'
                  : '/videos/W-MAX-PaperPlane-Loop.webm'
              }
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 90% 130% at 50% 50%, transparent 25%, var(--Elements-Twilight-0-90) 40%, var(--Elements-Twilight-0-90) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}
      </div>
    </Box>
  );
}
