import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './styles.module.css'

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_TIME  = 22    // bar-chart timeline length (time units)
const ROW_H     = 32    // height of each bar-chart row (px)
const ROW_GAP   = 6     // gap between bar-chart rows (px)
const LABEL_W   = 44    // fixed left-column width (px)
const BAR_H     = 20    // height of processing bars (px)
const ANIM_MS   = 80    // bar-chart timer interval (ms)
const ANIM_STEP = 0.15  // time units per tick → ~1.9 units/sec

const MAX_ITER  = 10    // total token iterations in the grid view
const ITER_MS   = 580   // ms between each iteration reveal

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = 'static' | 'dynamic' | 'continuous'

interface Block {
  id: string
  color: string
  arrive: number
  start: number
  end: number
  complete: number
}

interface Schedule {
  label: string
  badge: string
  description: string
  batchStarts: number[]
  blocks: Block[]
  batchNotes?: string[]
}

// One cell in the token-iteration grid
interface GridCell {
  requestId: string
  color: string
  isEnd: boolean  // true = this is the last token; slot frees next iteration
}

// One row (sequence position) in the grid
interface GridRowDef {
  label: string
  cells: (GridCell | null)[]  // null = no request active (idle)
}

// ── Schedule data ─────────────────────────────────────────────────────────────

const COLORS: Record<string, string> = {
  R1: '#4ade80',
  R2: '#60a5fa',
  R3: '#f472b6',
  R4: '#fb923c',
  R5: '#a78bfa',
  R6: '#fbbf24',
  R7: '#34d399',
  R8: '#818cf8',
}

const SCHEDULES: Record<Mode, Schedule> = {
  static: {
    label: 'Static',
    badge: 'batch size = 3',
    description:
      'Collects exactly 3 requests before starting. Every request in a batch is held until the slowest one finishes.',
    batchStarts: [7, 15],
    batchNotes: [
      'Batch 1 (t=7): R1, R2, R3 — waits until the 3rd request arrives; all held until R2 finishes at t=15',
      'Batch 2 (t=15): R4, R5, R6 — all held until R4 finishes at t=20',
    ],
    blocks: [
      { id: 'R1', color: COLORS.R1, arrive: 0,  start: 7,  end: 10, complete: 15 },
      { id: 'R2', color: COLORS.R2, arrive: 1,  start: 7,  end: 15, complete: 15 },
      { id: 'R3', color: COLORS.R3, arrive: 7,  start: 7,  end: 9,  complete: 15 },
      { id: 'R4', color: COLORS.R4, arrive: 8,  start: 15, end: 20, complete: 20 },
      { id: 'R5', color: COLORS.R5, arrive: 9,  start: 15, end: 17, complete: 20 },
      { id: 'R6', color: COLORS.R6, arrive: 10, start: 15, end: 19, complete: 20 },
    ],
  },
  dynamic: {
    label: 'Dynamic',
    badge: 'time window = 4 units, max size = 3',
    description:
      'Fires when a batch reaches 3 requests OR after a 4-unit window, whichever is first.',
    batchStarts: [4, 12, 17],
    batchNotes: [
      'Batch 1 (t=4): R1, R2 — timeout fires before the batch is full; held until R2 finishes at t=12',
      'Batch 2 (t=12): R3, R4, R5 — batch fills to the limit; held until R4 finishes at t=17',
      'Batch 3 (t=17): R6 — next window fires; finishes at t=21',
    ],
    blocks: [
      { id: 'R1', color: COLORS.R1, arrive: 0,  start: 4,  end: 7,  complete: 12 },
      { id: 'R2', color: COLORS.R2, arrive: 1,  start: 4,  end: 12, complete: 12 },
      { id: 'R3', color: COLORS.R3, arrive: 7,  start: 12, end: 14, complete: 17 },
      { id: 'R4', color: COLORS.R4, arrive: 8,  start: 12, end: 17, complete: 17 },
      { id: 'R5', color: COLORS.R5, arrive: 9,  start: 12, end: 14, complete: 17 },
      { id: 'R6', color: COLORS.R6, arrive: 10, start: 17, end: 21, complete: 21 },
    ],
  },
  continuous: {
    label: 'Continuous',
    badge: 'token-level scheduling',
    description:
      'The system processes all active sequences together and generates the next token for each active sequence. The moment a sequence emits its final token (END), the next queued request fills that position immediately.',
    batchStarts: [],
    blocks: [],  // unused; grid view has its own data below
  },
}

// ── Token-iteration grid (continuous mode) ────────────────────────────────────
//
// 3 sequence positions, 10 iterations (T1–T10). Every cell is occupied.
// END = final token of a request; the next request fills that position at T(n+1).

const CONTINUOUS_GRID: GridRowDef[] = [
  {
    label: 'Slot 1',
    cells: [
      { requestId: 'R1', color: COLORS.R1, isEnd: false }, // T1
      { requestId: 'R1', color: COLORS.R1, isEnd: false }, // T2
      { requestId: 'R1', color: COLORS.R1, isEnd: true  }, // T3  END → R4
      { requestId: 'R4', color: COLORS.R4, isEnd: false }, // T4
      { requestId: 'R4', color: COLORS.R4, isEnd: false }, // T5
      { requestId: 'R4', color: COLORS.R4, isEnd: false }, // T6
      { requestId: 'R4', color: COLORS.R4, isEnd: false }, // T7
      { requestId: 'R4', color: COLORS.R4, isEnd: true  }, // T8  END → R7
      { requestId: 'R7', color: COLORS.R7, isEnd: false }, // T9
      { requestId: 'R7', color: COLORS.R7, isEnd: true  }, // T10 END
    ],
  },
  {
    label: 'Slot 2',
    cells: [
      { requestId: 'R2', color: COLORS.R2, isEnd: false }, // T1
      { requestId: 'R2', color: COLORS.R2, isEnd: false }, // T2
      { requestId: 'R2', color: COLORS.R2, isEnd: false }, // T3
      { requestId: 'R2', color: COLORS.R2, isEnd: false }, // T4
      { requestId: 'R2', color: COLORS.R2, isEnd: false }, // T5
      { requestId: 'R2', color: COLORS.R2, isEnd: true  }, // T6  END → R5
      { requestId: 'R5', color: COLORS.R5, isEnd: false }, // T7
      { requestId: 'R5', color: COLORS.R5, isEnd: false }, // T8
      { requestId: 'R5', color: COLORS.R5, isEnd: false }, // T9
      { requestId: 'R5', color: COLORS.R5, isEnd: true  }, // T10 END
    ],
  },
  {
    label: 'Slot 3',
    cells: [
      { requestId: 'R3', color: COLORS.R3, isEnd: false }, // T1
      { requestId: 'R3', color: COLORS.R3, isEnd: true  }, // T2  END → R6
      { requestId: 'R6', color: COLORS.R6, isEnd: false }, // T3
      { requestId: 'R6', color: COLORS.R6, isEnd: false }, // T4
      { requestId: 'R6', color: COLORS.R6, isEnd: false }, // T5
      { requestId: 'R6', color: COLORS.R6, isEnd: true  }, // T6  END → R8
      { requestId: 'R8', color: COLORS.R8, isEnd: false }, // T7
      { requestId: 'R8', color: COLORS.R8, isEnd: false }, // T8
      { requestId: 'R8', color: COLORS.R8, isEnd: false }, // T9
      { requestId: 'R8', color: COLORS.R8, isEnd: true  }, // T10 END
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function pct(t: number): string {
  return `${(t / MAX_TIME) * 100}%`
}

function w(from: number, to: number): string {
  return `${(Math.max(0, to - from) / MAX_TIME) * 100}%`
}

function computeStats(schedule: Schedule) {
  if (schedule.blocks.length === 0) return { total: MAX_ITER, avg: '—' }
  const total = Math.max(...schedule.blocks.map((b) => b.complete))
  const avg = schedule.blocks.reduce((s, b) => s + (b.complete - b.arrive), 0) / schedule.blocks.length
  return { total, avg: avg.toFixed(1) }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BatchingSimulator() {
  const [mode, setMode]       = useState<Mode>('static')
  const [time, setTime]       = useState(0)
  const [iter, setIter]       = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isContinuous = mode === 'continuous'
  const schedule     = SCHEDULES[mode]
  const isDone       = isContinuous ? iter >= MAX_ITER : time >= MAX_TIME

  const N       = schedule.blocks.length
  const TRACK_H = N * ROW_H + (N - 1) * ROW_GAP
  const TOTAL_H = TRACK_H + 32

  const stats = useMemo(() => computeStats(schedule), [schedule])

  function clearTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => {
    if (!playing) { clearTimer(); return }
    if (isContinuous) {
      timerRef.current = setInterval(() => {
        setIter((prev) => {
          if (prev >= MAX_ITER) { setPlaying(false); return MAX_ITER }
          return prev + 1
        })
      }, ITER_MS)
    } else {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          const next = prev + ANIM_STEP
          if (next >= MAX_TIME) { setPlaying(false); return MAX_TIME }
          return next
        })
      }, ANIM_MS)
    }
    return clearTimer
  }, [playing, isContinuous])

  function switchMode(m: Mode) {
    clearTimer()
    setMode(m)
    setTime(0)
    setIter(0)
    setPlaying(false)
  }

  function handlePlay() {
    if (isContinuous) { if (iter >= MAX_ITER) setIter(0) }
    else              { if (time >= MAX_TIME) setTime(0) }
    setPlaying(true)
  }

  const barTop = (i: number) => i * (ROW_H + ROW_GAP) + (ROW_H - BAR_H) / 2

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Batching Strategy Simulator</div>
        <div className={styles.headerDesc}>
          See how each strategy schedules requests and uses GPU capacity
        </div>
      </div>

      <div className={styles.body}>
        {/* ── Mode tabs ── */}
        <div className={styles.tabs}>
          {(Object.keys(SCHEDULES) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`${styles.tab} ${mode === m ? styles.tabActive : ''}`}
              onClick={() => switchMode(m)}
            >
              {SCHEDULES[m].label}
            </button>
          ))}
        </div>

        {/* ── Mode description ── */}
        <div className={styles.modeDesc}>
          <span className={styles.badge}>{schedule.badge}</span>
          {schedule.description}
        </div>

        {/* ════════════════════════════════════════════════════════
            Continuous mode: token-iteration grid
            ════════════════════════════════════════════════════════ */}
        {isContinuous && (
          <>
          <div className={styles.tokenGridWrap}>
            {/* Column headers T1…T9 */}
            <div className={styles.gridHeaderRow}>
              <div className={styles.gridRowLabel} />
              {Array.from({ length: MAX_ITER }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.gridColHeader} ${i < iter ? styles.gridColHeaderDone : ''}`}
                >
                  T{i + 1}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {CONTINUOUS_GRID.map((row) => (
              <div key={row.label} className={styles.gridDataRow}>
                <div className={styles.gridRowLabel}>{row.label}</div>
                {row.cells.map((cell, ci) => {
                  const revealed = ci < iter
                  if (!revealed) {
                    return <div key={ci} className={`${styles.gridCellBase} ${styles.gridCellFuture}`} />
                  }
                  if (cell === null) {
                    return <div key={ci} className={`${styles.gridCellBase} ${styles.gridCellIdle}`} />
                  }
                  if (cell.isEnd) {
                    return (
                      <div key={ci} className={`${styles.gridCellBase} ${styles.gridCellEnd}`}>
                        END
                      </div>
                    )
                  }
                  return (
                    <div
                      key={ci}
                      className={`${styles.gridCellBase} ${styles.gridCellActive}`}
                      style={{ background: cell.color }}
                    >
                      {cell.requestId}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className={styles.decodeNote}>
            Note: The visualization focuses on decode scheduling. In real systems, prefill and decode are
            handled differently, and new requests may need prefill work before joining the active decode batch.
          </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            Static / dynamic: request bar chart
            ════════════════════════════════════════════════════════ */}
        {!isContinuous && (
          <div className={styles.timelineOuter} style={{ height: TOTAL_H }}>
            <div className={styles.labelCol} style={{ width: LABEL_W }}>
              {schedule.blocks.map((b, i) => (
                <div
                  key={b.id}
                  className={styles.rowLabel}
                  style={{ top: i * (ROW_H + ROW_GAP), height: ROW_H, color: b.color }}
                >
                  {b.id}
                </div>
              ))}
            </div>

            <div className={styles.trackArea} style={{ left: LABEL_W, height: TOTAL_H }}>
              {schedule.batchStarts.map((bs, bi) => {
                const bandEnd = schedule.batchStarts[bi + 1] ?? MAX_TIME
                if (time < bs) return null
                return (
                  <div
                    key={`band-${bi}`}
                    className={`${styles.batchBand} ${bi % 2 === 0 ? styles.bandEven : styles.bandOdd}`}
                    style={{ left: pct(bs), width: w(bs, Math.min(time, bandEnd)), height: TRACK_H }}
                  />
                )
              })}

              {schedule.blocks.map((b, i) => {
                const top      = barTop(i)
                const arrived  = time >= b.arrive
                const waitEnd  = Math.min(time, b.start)
                const runEnd   = Math.min(time, b.end)
                const holdEnd  = Math.min(time, b.complete)
                const complete = time >= b.complete
                return (
                  <div key={b.id}>
                    {arrived && (
                      <div className={styles.arrivalDot}
                        style={{ left: pct(b.arrive), top: top + BAR_H / 2 - 4, background: b.color }} />
                    )}
                    {arrived && waitEnd > b.arrive && (
                      <div className={styles.waitBar}
                        style={{ left: pct(b.arrive), width: w(b.arrive, waitEnd), top, height: BAR_H }} />
                    )}
                    {time >= b.start && runEnd > b.start && (
                      <div className={styles.runBar}
                        style={{ left: pct(b.start), width: w(b.start, runEnd), top, height: BAR_H, background: b.color }} />
                    )}
                    {b.end < b.complete && holdEnd > b.end && (
                      <div className={styles.holdBar}
                        style={{ left: pct(b.end), width: w(b.end, holdEnd), top, height: BAR_H, borderColor: b.color }} />
                    )}
                    {complete && (
                      <div className={styles.check}
                        style={{ left: pct(b.complete), top: top + BAR_H / 2 - 8, color: b.color }}>
                        ✓
                      </div>
                    )}
                  </div>
                )
              })}

              {schedule.batchStarts.map((bs) =>
                time >= bs ? (
                  <div key={`bm-${bs}`} className={styles.batchMarker} style={{ left: pct(bs), height: TRACK_H }} />
                ) : null
              )}

              {time > 0 && (
                <div className={styles.playhead} style={{ left: pct(time), height: TRACK_H + 4 }} />
              )}

              <div className={styles.axis} style={{ top: TRACK_H + 8 }}>
                <div className={styles.axisLine} />
                {Array.from({ length: Math.floor(MAX_TIME / 2) + 1 }, (_, i) => i * 2).map((t) => (
                  <div key={t} className={styles.tick} style={{ left: pct(t) }}>
                    <div className={styles.tickMark} />
                    <div className={styles.tickNum}>{t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Batch notes (static / dynamic) ── */}
        {!isContinuous && schedule.batchNotes && (
          <div className={styles.batchNotes}>
            {schedule.batchNotes.map((note, i) => (
              <div key={i} className={styles.batchNoteItem}>
                <span className={styles.batchNoteNum}>{i + 1}</span>
                {note}
              </div>
            ))}
          </div>
        )}

        {/* ── Controls ── */}
        <div className={styles.controls}>
          <div className={styles.ctrlBtns}>
            {!playing ? (
              <button type="button" className={styles.btnPlay} onClick={handlePlay}>
                {isDone ? '↺ Replay' : '▶ Play'}
              </button>
            ) : (
              <button type="button" className={styles.btnPause} onClick={() => setPlaying(false)}>
                ⏸ Pause
              </button>
            )}
            <button
              type="button"
              className={styles.btnReset}
              onClick={() => { setPlaying(false); setTime(0); setIter(0) }}
            >
              Reset
            </button>
          </div>
          <div className={styles.timeDisplay}>
            {isContinuous ? `T${iter} / T${MAX_ITER}` : `t = ${time.toFixed(1)}`}
          </div>
        </div>

        {/* ── Legend ── */}
        <div className={styles.legend}>
          {!isContinuous && (
            <>
              <div className={styles.legendItem}>
                <div className={styles.swatch} style={{ background: '#e5e7eb' }} />
                <span>Waiting for batch</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.swatchGroup}>
                  {['R1','R2','R3','R4','R5','R6'].map((id) => (
                    <div key={id} className={styles.swatch} style={{ background: COLORS[id] }} />
                  ))}
                </div>
                <span>Processing</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.swatch} ${styles.swatchHold}`} />
                <span>Done, held for batch</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.checkLegend}>✓</span>
                <span>Result returned</span>
              </div>
            </>
          )}
          {isContinuous && (
            <>
              <div className={styles.legendItem}>
                <div className={styles.swatchGroup}>
                  {['R1','R2','R3','R4','R5','R6','R7','R8'].map((id) => (
                    <div key={id} className={styles.swatch} style={{ background: COLORS[id] }} />
                  ))}
                </div>
                <span>Token generated</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.swatch} ${styles.swatchEnd}`} />
                <span>END: final token, next request fills this position immediately</span>
              </div>
            </>
          )}
        </div>

        {/* ── Strategy comparison table ── */}
        <div className={styles.cmpTable}>
          <div className={`${styles.cmpRow} ${styles.cmpHead}`}>
            <div className={styles.cmpFeature} />
            <div className={styles.cmpCell}>Static</div>
            <div className={styles.cmpCell}>Dynamic</div>
            <div className={styles.cmpCell}>Continuous</div>
          </div>
          {[
            {
              feature: 'Processing starts when',
              static:  'Batch is full',
              dynamic: 'Batch full or timeout',
              continuous: 'Request arrives (if capacity is available)',
            },
            {
              feature: 'Short requests held?',
              static:  'Yes, until slowest finishes',
              dynamic: 'Yes, until slowest finishes',
              continuous: 'No, completes immediately',
            },
            {
              feature: 'GPU idle between batches',
              static:  'Yes',
              dynamic: 'Yes',
              continuous: 'No',
            },
            {
              feature: 'Latency',
              static:  'High',
              dynamic: 'Medium',
              continuous: 'Low',
            },
            {
              feature: 'Throughput',
              static:  'Low–medium',
              dynamic: 'Medium',
              continuous: 'High',
            },
          ].map((row) => (
            <div key={row.feature} className={styles.cmpRow}>
              <div className={styles.cmpFeature}>{row.feature}</div>
              <div className={styles.cmpCell}>{row.static}</div>
              <div className={styles.cmpCell}>{row.dynamic}</div>
              <div className={styles.cmpCell}>{row.continuous}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
