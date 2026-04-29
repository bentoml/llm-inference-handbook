import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const PROMPT = 'What is LLM inference?'

const INPUT_TOKENS = ['What', ' is', ' LLM', ' infer', 'ence', '?']

const OUTPUT_TOKENS = [
  'LLM', ' inference', ' is', ' the', ' process',
  ' of', ' using', ' a', ' trained', ' model',
  ' to', ' generate', ' respon', 'ses', '.',
]

const TOKEN_INTERVAL_MS  = 200  // ms between each input token reveal
const OUTPUT_INTERVAL_MS = 280  // ms between each output token

// ── Types ──────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'tokenizing' | 'serving' | 'prefill' | 'decoding' | 'done'

const PHASE_ORDER: Phase[] = ['idle', 'tokenizing', 'serving', 'prefill', 'decoding', 'done']
const phaseIdx = (p: Phase) => PHASE_ORDER.indexOf(p)

// Which phases make each stage "active" (stage 0 = Tokenizer … stage 3 = Output)
const STAGE_ACTIVE: Phase[][] = [
  ['tokenizing'],
  ['serving'],
  ['prefill'],
  ['decoding'],
]

// The phase during which each arrow (0–2) shows its "flowing" animation
const ARROW_FLOW_PHASE: Phase[] = ['serving', 'prefill', 'decoding']

const STAGE_LABELS = ['Tokenizer', 'Scheduling', 'Prefill', 'Output']

// ── Component ─────────────────────────────────────────────────────────────────

export default function RequestLifecycle() {
  const [phase, setPhase]             = useState<Phase>('idle')
  const [tokensShown, setTokensShown] = useState(0)
  const [outputShown, setOutputShown] = useState(0)
  const iRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function clearTimers() {
    if (iRef.current) { clearInterval(iRef.current); iRef.current = null }
  }

  function reset() {
    clearTimers()
    setPhase('idle')
    setTokensShown(0)
    setOutputShown(0)
  }

  function play() {
    clearTimers()
    setTokensShown(0)
    setOutputShown(0)
    setPhase('tokenizing')
  }

  function advance() {
    clearTimers()
    const next = PHASE_ORDER[phaseIdx(phase) + 1] as Phase
    if (next) setPhase(next)
  }

  // Tokenizing: reveal one token at a time, then wait for user
  useEffect(() => {
    if (phase !== 'tokenizing') return
    let n = 0
    iRef.current = setInterval(() => {
      n++
      setTokensShown(n)
      if (n >= INPUT_TOKENS.length) { clearInterval(iRef.current!); iRef.current = null }
    }, TOKEN_INTERVAL_MS)
    return clearTimers
  }, [phase])

  // Decoding: reveal one output token at a time, then wait for user
  useEffect(() => {
    if (phase !== 'decoding') return
    setOutputShown(0)
    let n = 0
    iRef.current = setInterval(() => {
      n++
      setOutputShown(n)
      if (n >= OUTPUT_TOKENS.length) { clearInterval(iRef.current!); iRef.current = null }
    }, OUTPUT_INTERVAL_MS)
    return clearTimers
  }, [phase])

  // ── Derived state ────────────────────────────────────────────────────────────

  const curPi = phaseIdx(phase)

  // Next button is disabled while an internal animation is still running
  const animating =
    (phase === 'tokenizing' && tokensShown < INPUT_TOKENS.length) ||
    (phase === 'decoding'   && outputShown  < OUTPUT_TOKENS.length)

  const nextLabel: Partial<Record<Phase, string>> = {
    tokenizing: 'Scheduling →',
    serving:    'Prefill →',
    prefill:    'Decode →',
    decoding:   'Finish',
  }

  function stageStatus(idx: number): 'inactive' | 'active' | 'done' {
    const ap = STAGE_ACTIVE[idx]
    if (ap.includes(phase)) return 'active'
    if (curPi > Math.max(...ap.map(phaseIdx))) return 'done'
    return 'inactive'
  }

  function arrowStatus(idx: number): 'inactive' | 'flowing' | 'done' {
    const fp = phaseIdx(ARROW_FLOW_PHASE[idx])
    if (curPi === fp) return 'flowing'
    return curPi > fp ? 'done' : 'inactive'
  }

  function stageClass(st: ReturnType<typeof stageStatus>) {
    return st === 'active' ? styles.stageActive : st === 'done' ? styles.stageDone : styles.stageInactive
  }

  function stageNumClass(st: ReturnType<typeof stageStatus>) {
    return st === 'active' ? styles.stageNumActive : st === 'done' ? styles.stageNumDone : styles.stageNumInactive
  }

  function arrowClass(as: ReturnType<typeof arrowStatus>) {
    return as === 'flowing' ? styles.arrowFlowing : as === 'done' ? styles.arrowDone : styles.arrowInactive
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>LLM Inference Visualizer</div>
        <div className={styles.headerDesc}>
          Follow one prompt from input to streaming output
        </div>
      </div>
      <div className={styles.body}>

        {/* Static prompt display */}
        <div className={styles.promptRow}>
          <span className={styles.promptLabel}>Prompt</span>
          <span className={styles.promptText}>"{PROMPT}"</span>
        </div>

        {/* Pipeline: 4 stages + 3 arrows */}
        <div className={styles.pipeline}>
          {STAGE_LABELS.map((label, i) => {
            const st = stageStatus(i)
            return (
              <React.Fragment key={i}>
                <div className={`${styles.stage} ${stageClass(st)}`}>
                  <div className={`${styles.stageNum} ${stageNumClass(st)}`}>{i + 1}</div>
                  <div className={styles.stageLabel}>{label}</div>
                </div>
                {i < STAGE_LABELS.length - 1 && (
                  <div className={`${styles.arrow} ${arrowClass(arrowStatus(i))}`}>→</div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Detail panel: changes content per phase */}
        <div className={styles.detail}>

          {phase === 'idle' && (
            <div className={styles.idleMsg}>
              Press <strong>Play</strong> to send the prompt through the inference pipeline.
            </div>
          )}

          {phase === 'tokenizing' && (
            <div className={styles.detailContent}>
              <div className={styles.detailTitle}>Tokenizing prompt</div>
              <div className={styles.detailDesc}>
                The tokenizer splits raw text into subword units and maps them to integer IDs
                the model understands.
              </div>
              <div className={styles.chips}>
                {INPUT_TOKENS.slice(0, tokensShown).map((tok, i) => (
                  <span key={i} className={`${styles.chip} ${styles.chipInput}`}>
                    {tok.trim() === '' ? '·' : tok}
                  </span>
                ))}
                {tokensShown < INPUT_TOKENS.length && (
                  <span className={styles.ellipsis}>…</span>
                )}
              </div>
              <div className={styles.counter}>{tokensShown} / {INPUT_TOKENS.length} tokens</div>
            </div>
          )}

          {phase === 'serving' && (
            <div className={styles.detailContent}>
              <div className={styles.detailTitle}>Scheduling</div>
              <div className={styles.detailDesc}>
                The server receives the tokenized request, allocates a KV cache block,
                and enqueues it for the next prefill batch.
              </div>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepOk}>✓</span>
                  Request received: {INPUT_TOKENS.length} input tokens
                </div>
                <div className={styles.step}>
                  <span className={styles.stepOk}>✓</span>
                  KV cache block allocated
                </div>
                <div className={`${styles.step} ${styles.stepPending}`}>
                  <span className={styles.stepSpinner}>◌</span>
                  Scheduling for prefill…
                </div>
              </div>
            </div>
          )}

          {phase === 'prefill' && (
            <div className={styles.detailContent}>
              <div className={styles.detailTitle}>Prefill</div>
              <div className={styles.detailDesc}>
                All {INPUT_TOKENS.length} input tokens are processed in one parallel forward pass.
                Attention keys and values are written to the KV cache.
              </div>
              <div className={styles.prefillRow}>
                {INPUT_TOKENS.map((tok, i) => (
                  <span key={i} className={`${styles.chip} ${styles.chipPrefill}`}>
                    {tok.trim() === '' ? '·' : tok}
                  </span>
                ))}
                <span className={styles.kvLabel}>→ KV cache</span>
              </div>
            </div>
          )}

          {(phase === 'decoding' || phase === 'done') && (
            <div className={styles.detailContent}>
              <div className={styles.detailTitle}>
                {phase === 'done' ? 'Response complete' : 'Decode phase — streaming'}
              </div>
              <div className={styles.detailDesc}>
                One token per forward pass, streamed back to the client as soon as it is produced.
              </div>
              <div className={styles.outputBox}>
                <span className={styles.outputText}>
                  {OUTPUT_TOKENS.slice(0, outputShown).join('')}
                </span>
                {phase === 'decoding' && <span className={styles.cursor}>▋</span>}
              </div>
              <div className={styles.counter}>
                {outputShown} / {OUTPUT_TOKENS.length} output tokens generated
              </div>
            </div>
          )}

        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {phase === 'idle' && (
            <button className={styles.btnPlay} onClick={play}>Play</button>
          )}

          {phase === 'done' && (
            <button className={styles.btnPlay} onClick={play}>Play again</button>
          )}

          {phase !== 'idle' && phase !== 'done' && (
            <>
              <button className={styles.btnReset} onClick={reset}>Reset</button>
              <button
                className={styles.btnNext}
                onClick={advance}
                disabled={animating}
              >
                {nextLabel[phase]}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
