import { Fragment, useMemo, useState } from 'react'
import styles from './styles.module.css'

const PROMPT_OPTIONS = [8_000, 20_000, 32_000]
const CHUNK_OPTIONS = [2_000, 4_000, 8_000]
const DECODE_STEPS = 3
const MAX_PREFILL_COLS = 5

const ROWS = ['A', 'B', 'C'] as const
type Row = (typeof ROWS)[number]

type Mode = 'whole' | 'chunked'
type Phase =
  | 'prefillAB'
  | 'decodeAB'
  | 'wholePrefill'
  | 'prefill'
  | 'morePrefill'
  | 'decode'
  | 'moreDecode'
type Column = { phase: Phase; size?: number; width: number }

const WIDTH = {
  wholePrefill: 172,
  prefill: 96,
  decode: 78,
  ellipsis: 46,
}

function formatTokens(tokens: number) {
  if (tokens >= 1_000) {
    const value = tokens / 1_000
    return `${Number.isInteger(value) ? value : value.toFixed(1)}K`
  }

  return String(tokens)
}

export default function ChunkedPrefillVisualizer() {
  const [mode, setMode] = useState<Mode>('whole')
  const [promptTokens, setPromptTokens] = useState(32_000)
  const [chunkTokens, setChunkTokens] = useState(2_000)

  const chunks = useMemo(() => {
    const result: number[] = []
    let remaining = promptTokens

    while (remaining > 0) {
      const size = Math.min(chunkTokens, remaining)
      result.push(size)
      remaining -= size
    }

    return result
  }, [chunkTokens, promptTokens])

  const columns = useMemo<Column[]>(() => {
    const cols: Column[] = []

    cols.push({ phase: 'prefillAB', width: WIDTH.prefill })
    cols.push({ phase: 'decodeAB', width: WIDTH.decode })

    if (mode === 'whole') {
      cols.push({ phase: 'wholePrefill', size: promptTokens, width: WIDTH.wholePrefill })
    } else {
      const overflow = chunks.length > MAX_PREFILL_COLS
      const visible = overflow ? chunks.slice(0, MAX_PREFILL_COLS - 1) : chunks
      visible.forEach((size) => cols.push({ phase: 'prefill', size, width: WIDTH.prefill }))
      if (overflow) {
        cols.push({ phase: 'morePrefill', width: WIDTH.ellipsis })
      }
    }

    for (let i = 0; i < DECODE_STEPS; i += 1) {
      cols.push({ phase: 'decode', width: WIDTH.decode })
    }
    cols.push({ phase: 'moreDecode', width: WIDTH.ellipsis })

    return cols
  }, [mode, chunks, promptTokens])

  const gridTemplateColumns = `var(--label-w) ${columns.map((col) => `${col.width}px`).join(' ')}`

  function handlePromptChange(nextPromptTokens: number) {
    setPromptTokens(nextPromptTokens)
    if (chunkTokens > nextPromptTokens) {
      setChunkTokens(nextPromptTokens)
    }
  }

  function cell(key: number, kind: string, title?: string, sub?: string) {
    return (
      <div key={key} className={`${styles.cell} ${kind}`}>
        {title ? <strong>{title}</strong> : null}
        {sub ? <span>{sub}</span> : null}
      </div>
    )
  }

  function empty(key: number) {
    return <div key={key} className={styles.empty} />
  }

  function decodeEllipsis(key: number) {
    return (
      <div key={key} className={`${styles.cell} ${styles.ellipsis} ${styles.decode}`}>
        …
      </div>
    )
  }

  function renderCell(row: Row, col: Column, key: number) {
    const isC = row === 'C'

    switch (col.phase) {
      case 'prefillAB':
        if (isC) return empty(key)
        return cell(key, styles.prefill, 'Prefill')
      case 'decodeAB':
        if (isC) return empty(key)
        return cell(key, styles.decode, 'Decode')
      case 'wholePrefill':
        if (isC) return cell(key, styles.prefill, 'Prefill', `${formatTokens(col.size ?? 0)} tokens`)
        return cell(key, styles.stall, 'Stalled', 'decode paused')
      case 'prefill':
        if (isC) return cell(key, styles.prefill, 'Prefill', formatTokens(col.size ?? 0))
        return cell(key, styles.decode, 'Decode')
      case 'morePrefill':
        if (isC)
          return (
            <div key={key} className={`${styles.cell} ${styles.ellipsis} ${styles.prefill}`}>
              …
            </div>
          )
        return decodeEllipsis(key)
      case 'decode':
        return cell(key, styles.decode, 'Decode')
      case 'moreDecode':
      default:
        return decodeEllipsis(key)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Chunked Prefill Scheduler</div>
        <div className={styles.headerDesc}>
          A and B are decoding when C arrives with a long prompt. See how the scheduler fits C's
          prefill onto the same GPU timeline.
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.controls}>
          <div className={styles.presets} role="tablist" aria-label="Schedule mode">
            <button
              type="button"
              className={`${styles.preset} ${mode === 'whole' ? styles.presetActive : ''}`}
              aria-pressed={mode === 'whole'}
              onClick={() => setMode('whole')}
            >
              Whole prefill
            </button>
            <button
              type="button"
              className={`${styles.preset} ${mode === 'chunked' ? styles.presetActive : ''}`}
              aria-pressed={mode === 'chunked'}
              onClick={() => setMode('chunked')}
            >
              Chunked prefill
            </button>
          </div>

          <label className={styles.control}>
            <span>C's prompt</span>
            <select
              value={promptTokens}
              onChange={(event) => handlePromptChange(Number(event.target.value))}
            >
              {PROMPT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {formatTokens(option)} tokens
                </option>
              ))}
            </select>
          </label>

          <label className={`${styles.control} ${mode === 'whole' ? styles.controlDisabled : ''}`}>
            <span>Chunk size</span>
            <select
              value={chunkTokens}
              disabled={mode === 'whole'}
              onChange={(event) => setChunkTokens(Number(event.target.value))}
            >
              {CHUNK_OPTIONS.filter((option) => option <= promptTokens).map((option) => (
                <option key={option} value={option}>
                  {formatTokens(option)} tokens
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.legend} aria-label="Timeline legend">
          <span>
            <i className={`${styles.swatch} ${styles.prefillSwatch}`} />
            Prefill
          </span>
          <span>
            <i className={`${styles.swatch} ${styles.decodeSwatch}`} />
            Decode
          </span>
          <span>
            <i className={`${styles.swatch} ${styles.stallSwatch}`} />
            Stalled
          </span>
        </div>

        <div className={styles.timeline}>
          <div className={styles.grid} style={{ gridTemplateColumns }}>
            {ROWS.map((row) => (
              <Fragment key={`row-${row}`}>
                <div className={styles.rowLabel}>Request {row}</div>
                {columns.map((col, index) => renderCell(row, col, index))}
              </Fragment>
            ))}
          </div>
        </div>
        <div className={styles.axis}>
          <span className={styles.axisSpacer} />
          <span className={styles.axisLine}>Time →</span>
        </div>

        <div className={styles.caption}>
          {mode === 'whole'
            ? "The whole prompt of request C runs in one iteration. A and B can't emit a token until it finishes."
            : "The prompt of request C is split into small chunks, so A and B keep decoding in the same batch as each chunk."}
        </div>

        <div className={styles.metrics}>
          <div>
            <span>Decode stall for A &amp; B</span>
            <strong className={mode === 'whole' ? styles.bad : styles.good}>
              {mode === 'whole' ? '1 long iteration' : 'No prefill-only stall'}
            </strong>
          </div>
          <div>
            <span>Prefill rounds for C</span>
            <strong>{mode === 'whole' ? 1 : chunks.length}</strong>
          </div>
          <div>
            <span>Largest prefill block</span>
            <strong>
              {formatTokens(mode === 'whole' ? promptTokens : Math.min(chunkTokens, promptTokens))} tokens
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}
