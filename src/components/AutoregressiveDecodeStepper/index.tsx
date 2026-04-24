import { useEffect, useMemo, useState } from 'react'
import styles from './styles.module.css'

interface Candidate {
  token: string
  probability: number
}

interface DecodeStep {
  token: string
  candidates: Candidate[]
}

const PREFILL_TOKENS = ['BentoML', ' is', ' a', ' unified', ' inference']

const DECODE_STEPS: DecodeStep[] = [
  {
    token: ' platform',
    candidates: [
      { token: ' platform', probability: 0.64 },
      { token: ' stack', probability: 0.18 },
      { token: ' engine', probability: 0.11 },
      { token: ' service', probability: 0.07 },
    ],
  },
  {
    token: ' for',
    candidates: [
      { token: ' for', probability: 0.58 },
      { token: ' built', probability: 0.21 },
      { token: ' that', probability: 0.13 },
      { token: '.', probability: 0.08 },
    ],
  },
  {
    token: ' serving',
    candidates: [
      { token: ' serving', probability: 0.62 },
      { token: ' running', probability: 0.16 },
      { token: ' inference', probability: 0.13 },
      { token: ' deploying', probability: 0.09 },
    ],
  },
  {
    token: ' models',
    candidates: [
      { token: ' models', probability: 0.67 },
      { token: ' LLMs', probability: 0.17 },
      { token: ' APIs', probability: 0.09 },
      { token: ' workloads', probability: 0.07 },
    ],
  },
  {
    token: '.',
    candidates: [
      { token: '.', probability: 0.74 },
      { token: ' today', probability: 0.12 },
      { token: ' efficiently', probability: 0.08 },
      { token: ',', probability: 0.06 },
    ],
  },
]

const AUTO_PLAY_MS = 950

function formatToken(token: string) {
  return token.trimStart()
}

export default function AutoregressiveDecodeStepper() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing || step >= DECODE_STEPS.length) {
      if (step >= DECODE_STEPS.length) {
        setPlaying(false)
      }
      return
    }

    const timer = setTimeout(() => {
      setStep((current) => Math.min(current + 1, DECODE_STEPS.length))
    }, AUTO_PLAY_MS)

    return () => clearTimeout(timer)
  }, [playing, step])

  const generatedSteps = DECODE_STEPS.slice(0, step)
  const visibleTokens = useMemo(
    () => [...PREFILL_TOKENS, ...generatedSteps.map((decodeStep) => decodeStep.token)],
    [generatedSteps]
  )

  const nextStep = step < DECODE_STEPS.length ? DECODE_STEPS[step] : null
  const generatedText = visibleTokens.join('')
  const progress = (step / DECODE_STEPS.length) * 100

  function handleStep() {
    if (step < DECODE_STEPS.length) {
      setStep(step + 1)
    }
  }

  function handleTogglePlay() {
    if (step >= DECODE_STEPS.length) {
      setStep(0)
      setPlaying(true)
      return
    }

    setPlaying((current) => !current)
  }

  function handleReset() {
    setPlaying(false)
    setStep(0)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Autoregressive decode stepper</div>
        <div className={styles.headerDesc}>
          Step through one decode loop and watch each new token extend the sequence and KV cache.
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleStep}
            disabled={playing || step >= DECODE_STEPS.length}
          >
            Step
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleTogglePlay}
          >
            {step >= DECODE_STEPS.length ? 'Replay' : playing ? 'Pause' : 'Autoplay'}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleReset}
            disabled={step === 0 && !playing}
          >
            Reset
          </button>
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Decode step {Math.min(step + 1, DECODE_STEPS.length)} / {DECODE_STEPS.length}
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainPanel}>
            <div className={styles.sectionLabel}>Sequence so far</div>
            <div className={styles.tokenRow}>
              {visibleTokens.map((token, index) => {
                const isGenerated = index >= PREFILL_TOKENS.length
                return (
                  <div
                    key={`${token}-${index}`}
                    className={`${styles.tokenChip} ${isGenerated ? styles.generatedToken : styles.prefillToken}`}
                  >
                    <span className={styles.tokenIndex}>T{index + 1}</span>
                    <span className={styles.tokenValue}>{formatToken(token)}</span>
                  </div>
                )
              })}
              {nextStep && (
                <div className={`${styles.tokenChip} ${styles.pendingToken}`}>
                  <span className={styles.tokenIndex}>T{visibleTokens.length + 1}</span>
                  <span className={styles.tokenValue}>?</span>
                </div>
              )}
            </div>

            <div className={styles.outputBox}>
              <div className={styles.outputLabel}>Decoded text</div>
              <div className={styles.outputText}>
                {generatedText}
                {nextStep && <span className={styles.cursor}>▋</span>}
              </div>
            </div>

            <div className={styles.summaryCard}>
              {nextStep ? (
                <>
                  <div className={styles.summaryTitle}>
                    Predicting T{visibleTokens.length + 1}: <code>{formatToken(nextStep.token)}</code>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.summaryTitle}>Decode complete</div>
                </>
              )}
            </div>
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.sideSection}>
              <div className={styles.sectionLabel}>Next-token distribution</div>
              {nextStep ? (
                <div className={styles.candidateList}>
                  {nextStep.candidates.map((candidate) => {
                    const isChosen = candidate.token === nextStep.token
                    return (
                      <div
                        key={candidate.token}
                        className={`${styles.candidateRow} ${isChosen ? styles.candidateChosen : ''}`}
                      >
                        <div className={styles.candidateHead}>
                          <code>{formatToken(candidate.token)}</code>
                          <span>{Math.round(candidate.probability * 100)}%</span>
                        </div>
                        <div className={styles.candidateTrack}>
                          <div
                            className={styles.candidateFill}
                            style={{ width: `${candidate.probability * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={styles.doneBox}>
                  Stop condition reached. In real systems this may be EOS, a stop string, or the max token limit.
                </div>
              )}
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sectionLabel}>KV cache reuse</div>
              <div className={styles.kvPanel}>
                <div className={styles.metrics}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricValue}>{visibleTokens.length}</span>
                    <span className={styles.metricLabel}>tokens already cached</span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={styles.metricValue}>{nextStep ? 1 : 0}</span>
                    <span className={styles.metricLabel}>new token computed now</span>
                  </div>
                </div>
                <div className={styles.cacheStrip}>
                  <div className={styles.cacheStripLabel}>Cache blocks</div>
                  <div className={styles.cacheRow}>
                    {visibleTokens.map((token, index) => {
                      const isGenerated = index >= PREFILL_TOKENS.length
                      return (
                        <span
                          key={`cache-${token}-${index}`}
                          className={`${styles.cacheBlock} ${isGenerated ? styles.cacheGenerated : styles.cachePrefill}`}
                        />
                      )
                    })}
                    {nextStep && <span className={`${styles.cacheBlock} ${styles.cachePending}`} />}
                  </div>
                </div>
                <div className={styles.cacheCaption}>
                  Decode reads the growing cache every step and writes K/V only for the newest token.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
