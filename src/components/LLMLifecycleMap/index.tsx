import { useState, Fragment } from 'react'
import styles from './styles.module.css'

type Focus = 'loop' | 'training' | 'inference'

interface Stage {
  id: string
  label: string
  tag: string
  highlight?: boolean
}

const BUILD: Stage[] = [
  { id: 'data', label: 'Data', tag: 'collect & prep' },
  { id: 'train', label: 'Train', tag: 'learn weights' },
  { id: 'eval', label: 'Evaluate', tag: 'test quality' },
]

const OPERATE: Stage[] = [
  { id: 'deploy', label: 'Deploy', tag: 'package & load' },
  { id: 'serve', label: 'Infer', tag: 'run on every request', highlight: true },
  { id: 'optimize', label: 'Optimize', tag: 'batching, caching, etc.' },
]

const FOCUS_LABELS: Record<Focus, string> = {
  loop: 'Lifecycle',
  training: 'Training',
  inference: 'Inference',
}

const NOTES: Record<Focus, { runs: string; measure: string }> = {
  loop: {
    runs: 'Build once, then operate continuously',
    measure: 'Quality while building; latency & cost in production',
  },
  training: {
    runs: 'Once — a long offline batch job',
    measure: 'Accuracy, loss, eval score',
  },
  inference: {
    runs: 'On every request — an always-on service',
    measure: 'Latency, throughput, cost per request',
  },
}

export default function LLMLifecycleMap() {
  const [focus, setFocus] = useState<Focus>('loop')
  const note = NOTES[focus]

  const phases = [
    {
      key: 'build',
      title: 'Build',
      stages: BUILD,
      active: focus === 'loop' || focus === 'training',
    },
    {
      key: 'operate',
      title: 'Operate',
      stages: OPERATE,
      active: focus === 'loop' || focus === 'inference',
    },
  ]

  return (
    <section className={styles.container} aria-label="LLM lifecycle map">
      <div className={styles.header}>
        <div>
          <div className={styles.title}>LLM Lifecycle Visualizer</div>
          <div className={styles.subtitle}>Built once. Inference runs on every request.</div>
        </div>
        <div className={styles.controls} role="group" aria-label="Focus">
          {(Object.keys(FOCUS_LABELS) as Focus[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.control} ${focus === key ? styles.controlActive : ''}`}
              onClick={() => setFocus(key)}
              aria-pressed={focus === key}
            >
              {FOCUS_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.flow}>
        {phases.map((phase, pi) => (
          <Fragment key={phase.key}>
            <div
              className={[
                styles.phase,
                styles[phase.key],
                phase.active ? styles.phaseActive : styles.phaseMuted,
              ].join(' ')}
            >
              <div className={styles.phaseHead}>
                <span className={styles.phaseTitle}>{phase.title}</span>
              </div>
              <div className={styles.steps}>
                {phase.stages.map((stage, si) => (
                  <div className={styles.stepWrap} key={stage.id}>
                    <div className={`${styles.step} ${stage.highlight ? styles.stepHighlight : ''}`}>
                      <span className={styles.stepLabel}>{stage.label}</span>
                      <span className={styles.stepTag}>{stage.tag}</span>
                    </div>
                    {si < phase.stages.length - 1 && <span className={styles.arrow}>→</span>}
                  </div>
                ))}
              </div>
            </div>
            {pi === 0 && (
              <span className={styles.handoff} aria-hidden="true">
                →
              </span>
            )}
          </Fragment>
        ))}
      </div>

      <div className={styles.loopback} aria-hidden="true">
        <span className={styles.loopbackIcon}>↻</span>
        Live usage and fresh data feed the next build cycle
      </div>

      <div className={styles.summary}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>When it runs</span>
          <span className={styles.statValue}>{note.runs}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>What you measure</span>
          <span className={styles.statValue}>{note.measure}</span>
        </div>
      </div>
    </section>
  )
}
