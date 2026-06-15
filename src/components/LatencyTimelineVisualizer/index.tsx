import { useEffect, useState } from 'react'
import styles from './styles.module.css'

// Real-ish durations (ms) used for the metric values + elapsed counter.
const TOKENIZE = 3
const PREFILL = 180
const DECODE = 22
const DETOK = 2

// Playback dwell time (ms) per stage — scaled for watchability.
const ANIM = { tokenize: 280, prefill: 900, decode: 480, detok: 280 } as const

// Visual weights keep every stage readable (prefill stays biggest,
// detok stays a small sliver) without the prefill block swallowing the row.
const WEIGHT = { tokenize: 1, prefill: 7, decode: 3, detok: 1.5 } as const

// The text the model "generates" — one entry per output token (on-topic).
const OUTPUT = ['Decode', ' emits', ' one', ' token', ' per', ' step']

type StageType = keyof typeof WEIGHT
type Metric = 'ttft' | 'itl' | 'e2el'

interface Stage {
  type: StageType
  label: string
  token?: number // 1-based token index for decode/detok
}

function buildStages(n: number): Stage[] {
  const stages: Stage[] = [
    { type: 'tokenize', label: 'Tokenize' },
    { type: 'prefill', label: 'Prefill' },
  ]
  for (let i = 1; i <= n; i++) {
    stages.push({ type: 'decode', label: 'Decode', token: i })
    stages.push({ type: 'detok', label: 'Detok', token: i })
  }
  return stages
}

const REAL = { tokenize: TOKENIZE, prefill: PREFILL, decode: DECODE, detok: DETOK }

const METRICS: Record<Metric, { name: string; full: string; desc: string }> = {
  ttft: {
    name: 'TTFT',
    full: 'Time to first token',
    desc: 'Prompt submitted → first token shown',
  },
  itl: {
    name: 'ITL',
    full: 'Inter-token latency',
    desc: 'Gap between two consecutive tokens',
  },
  e2el: {
    name: 'E2EL',
    full: 'End-to-end latency',
    desc: 'Prompt submitted → full response done',
  },
}

export default function LatencyTimelineVisualizer() {
  const tokens = 6
  const [metric, setMetric] = useState<Metric>('ttft')

  // Playback: step = index of the active stage. -1 = idle (static mode),
  // stages.length = finished.
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)

  const stages = buildStages(tokens)
  const anim = step >= 0

  const ttft = TOKENIZE + PREFILL + DECODE + DETOK
  const itl = DECODE + DETOK
  const e2el = TOKENIZE + PREFILL + tokens * (DECODE + DETOK)
  const value = metric === 'ttft' ? ttft : metric === 'itl' ? itl : e2el

  // Drive the animation one stage at a time.
  useEffect(() => {
    if (!playing) return
    if (step >= stages.length) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setStep((s) => s + 1), ANIM[stages[step].type])
    return () => clearTimeout(id)
  }, [playing, step, stages.length])

  function metricHighlight(s: Stage): boolean {
    if (metric === 'e2el') return true
    if (metric === 'ttft')
      return s.type === 'tokenize' || s.type === 'prefill' || s.token === 1
    // itl: every decode→detok pair from the 2nd token onward (gaps between tokens)
    return (s.type === 'decode' || s.type === 'detok') && (s.token ?? 0) >= 2
  }

  // Grid column template shared by the timeline and the bracket row so brackets
  // line up exactly under their boxes.
  const cols = stages.map((s) => `${WEIGHT[s.type]}fr`).join(' ')

  // Brackets to draw under the boxes for the selected metric.
  // start/end are 0-based box indices, inclusive.
  const brackets: { start: number; end: number; label: string }[] =
    metric === 'ttft'
      ? [{ start: 0, end: 3, label: 'TTFT' }]
      : metric === 'e2el'
        ? [{ start: 0, end: stages.length - 1, label: 'E2EL' }]
        : Array.from({ length: tokens - 1 }, (_, k) => {
            const decodeIdx = 2 * (k + 2) // decode box of token (k+2)
            return { start: decodeIdx, end: decodeIdx + 1, label: 'ITL' }
          })

  function blockClass(s: Stage, i: number): string {
    if (anim) {
      if (i === step) return styles.active
      if (i < step) return '' // done — full opacity
      return styles.dim // future
    }
    return metricHighlight(s) ? '' : styles.dim
  }

  // Generated text so far: token k appears once its Detok (index 2k+1) is reached.
  const generated = OUTPUT.slice(0, tokens)
    .filter((_, idx) => step >= 2 * (idx + 1) + 1)
    .join('')
  const tokensDone = OUTPUT.slice(0, tokens).filter(
    (_, idx) => step >= 2 * (idx + 1) + 1,
  ).length

  // Elapsed real latency through the active stage.
  const elapsed = !anim
    ? 0
    : stages
        .slice(0, Math.min(step + 1, stages.length))
        .reduce((a, s) => a + REAL[s.type], 0)

  function reset() {
    setPlaying(false)
    setStep(-1)
  }

  function onPlay() {
    if (playing) {
      setPlaying(false) // pause
    } else if (step < 0 || step >= stages.length) {
      setStep(0) // start / replay
      setPlaying(true)
    } else {
      setPlaying(true) // resume
    }
  }

  const finished = step >= stages.length
  const playLabel = playing ? 'Pause' : finished ? 'Replay' : step < 0 ? 'Play' : 'Resume'

  const formula =
    metric === 'ttft'
      ? `Tokenize + Prefill + Decode + Detok = ${TOKENIZE} + ${PREFILL} + ${DECODE} + ${DETOK}`
      : metric === 'itl'
        ? `Decode + Detok = ${DECODE} + ${DETOK}`
        : `TTFT + (${tokens} − 1) × ITL = ${ttft} + ${tokens - 1} × ${itl}`

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Latency Timeline Visualizer</div>
        <div className={styles.headerDesc}>
          Press play to watch each decode step emit a token through
          detokenization. Pick a metric to see which stages it spans.
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.controls}>
          <div className={styles.pills}>
            {(Object.keys(METRICS) as Metric[]).map((m) => (
              <button
                key={m}
                className={`${styles.pill} ${metric === m ? styles.pillActive : ''}`}
                onClick={() => {
                  reset()
                  setMetric(m)
                }}
              >
                {METRICS[m].name}
              </button>
            ))}
          </div>
          <span className={styles.tokenCount}>{tokens} output tokens</span>
        </div>

        <div className={styles.resultBox}>
          <div className={styles.resultMain}>
            <span className={styles.resultName}>{METRICS[metric].full}</span>
            <span className={styles.resultValue}>{value} ms</span>
          </div>
          <div className={styles.resultDesc}>{METRICS[metric].desc}</div>
          <div className={styles.resultFormula}>{formula}</div>
        </div>

        <div className={styles.timeline} style={{ gridTemplateColumns: cols }}>
          {stages.map((s, i) => (
            <div
              key={i}
              className={`${styles.block} ${styles[s.type]} ${blockClass(s, i)}`}
              title={`${s.label}${s.token ? ` (token ${s.token})` : ''}`}
            />
          ))}
        </div>

        <div className={styles.brackets} style={{ gridTemplateColumns: cols }}>
          {brackets.map((b, i) => (
            <div
              key={i}
              className={styles.bracket}
              style={{ gridColumn: `${b.start + 1} / ${b.end + 2}` }}
            >
              <div className={styles.bracketLine} />
              <div className={styles.bracketLabel}>{b.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.playback}>
          <button className={styles.playBtn} onClick={onPlay}>
            {playLabel}
          </button>
          {anim && (
            <button className={styles.resetBtn} onClick={reset}>
              Reset
            </button>
          )}
          <span className={styles.elapsed}>
            {elapsed} ms · {tokensDone}/{tokens} tokens
          </span>
          <span className={styles.output}>
            {generated ? (
              <>
                {generated}
                {playing && <span className={styles.caret} />}
              </>
            ) : (
              <span className={styles.outputHint}>output appears here…</span>
            )}
          </span>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.tokenize}`} /> Tokenization
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.prefill}`} /> Prefill
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.decode}`} /> Decode
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.detok}`} /> Detokenization
          </span>
        </div>

        <div className={styles.assumptions}>
          Assume Tokenization = {TOKENIZE} ms, Prefill = {PREFILL} ms, Decode ={' '}
          {DECODE} ms, Detokenization = {DETOK} ms, with ITL constant across
          decode steps. Real values vary with model, hardware, and sequence
          length.
        </div>
      </div>
    </div>
  )
}
