import { useEffect, useState } from 'react'
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
    token: ' deploying',
    candidates: [
      { token: ' deploying', probability: 0.55 },
      { token: ' serving', probability: 0.22 },
      { token: ' running', probability: 0.14 },
      { token: ' building', probability: 0.09 },
    ],
  },
  {
    token: ' and',
    candidates: [
      { token: ' and', probability: 0.61 },
      { token: ',', probability: 0.18 },
      { token: ' &', probability: 0.12 },
      { token: ' plus', probability: 0.09 },
    ],
  },
  {
    token: ' scaling',
    candidates: [
      { token: ' scaling', probability: 0.57 },
      { token: ' serving', probability: 0.2 },
      { token: ' running', probability: 0.14 },
      { token: ' managing', probability: 0.09 },
    ],
  },
  {
    token: ' AI',
    candidates: [
      { token: ' AI', probability: 0.52 },
      { token: ' LLM', probability: 0.24 },
      { token: ' ML', probability: 0.15 },
      { token: ' large', probability: 0.09 },
    ],
  },
  {
    token: ' models',
    candidates: [
      { token: ' models', probability: 0.67 },
      { token: ' workloads', probability: 0.14 },
      { token: ' systems', probability: 0.11 },
      { token: ' apps', probability: 0.08 },
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
  const trimmed = token.trimStart()
  return trimmed === '' ? token : trimmed
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
  const visibleTokens = [
    ...PREFILL_TOKENS,
    ...generatedSteps.map((decodeStep) => decodeStep.token),
  ]

  const nextStep = step < DECODE_STEPS.length ? DECODE_STEPS[step] : null
  const isDone = !nextStep
  const progress = (step / DECODE_STEPS.length) * 100
  const cachedCount = visibleTokens.length
  const generatedCount = generatedSteps.length

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
        <div className={styles.headerTitle}>Token-by-Token Decode Loop</div>
        <div className={styles.headerDesc}>
          Step through the decode loop. Each step picks one token from a distribution and appends it to the sequence.
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.controls}>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleStep}
              disabled={playing || isDone}
            >
              Step
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleTogglePlay}
            >
              {isDone ? 'Replay' : playing ? 'Pause' : 'Autoplay'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleReset}
              disabled={step === 0 && !playing}
            >
              Reset
            </button>
          </div>
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              {isDone
                ? `Done · ${DECODE_STEPS.length} / ${DECODE_STEPS.length}`
                : `Step ${step + 1} / ${DECODE_STEPS.length}`}
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className={styles.sequenceBlock}>
          <div className={styles.sectionLabel}>Sequence</div>
          <div className={styles.tokenRow}>
            {visibleTokens.map((token, index) => {
              const isGenerated = index >= PREFILL_TOKENS.length
              return (
                <div
                  key={`${token}-${index}`}
                  className={`${styles.tokenChip} ${isGenerated ? styles.generatedToken : styles.prefillToken}`}
                >
                  <span className={styles.tokenIndex}>T{index}</span>
                  <span className={styles.tokenValue}>{formatToken(token)}</span>
                </div>
              )
            })}
            {nextStep && (
              <div className={`${styles.tokenChip} ${styles.pendingToken}`}>
                <span className={styles.tokenIndex}>T{visibleTokens.length}</span>
                <span className={styles.tokenValue}>?</span>
              </div>
            )}
          </div>
          <div className={styles.legendRow}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.legendPrefill}`} />
              Existing · {PREFILL_TOKENS.length}
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.legendGenerated}`} />
              Generated · {generatedCount}
            </span>
            {nextStep && (
              <span className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${styles.legendPending}`} />
                Next
              </span>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
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
                <div className={styles.doneTitle}>Stop criterion reached</div>
                <div className={styles.doneBody}>
                  In practice, this is an EOS token, a stop string, or the max-token limit.
                </div>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.sectionLabel}>KV cache</div>
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
            <div className={styles.cacheCaption}>
              {nextStep ? (
                <>
                  Reuses <strong>{cachedCount}</strong> cached K/V pair{cachedCount === 1 ? '' : 's'}; computes <strong>1</strong> new one this step.
                </>
              ) : (
                <>
                  Cache holds <strong>{cachedCount}</strong> K/V pairs from prefill + decode, ready to seed the next request.
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
