import { useState } from 'react'
import styles from './styles.module.css'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Request {
  id: number
  ttft: number    // ms
  e2el: number    // ms
  tokens: number  // output tokens
}

// ── Preset datasets ───────────────────────────────────────────────────────────

type PresetRows = Omit<Request, 'id'>[]

const PRESETS: { label: string; rows: PresetRows | null; sloTTFT: number; sloE2EL: number }[] = [
  { label: 'Custom',         rows: null,  sloTTFT: 200,  sloE2EL: 3000 },
  {
    label: 'Mixed workload',
    sloTTFT: 200, sloE2EL: 3000,
    rows: [
      { ttft: 45,  e2el: 1200, tokens: 120 },
      { ttft: 120, e2el: 800,  tokens: 80  },
      { ttft: 60,  e2el: 3500, tokens: 350 },
      { ttft: 200, e2el: 600,  tokens: 55  },
      { ttft: 80,  e2el: 2200, tokens: 220 },
      { ttft: 350, e2el: 1800, tokens: 180 },
    ],
  },
  {
    label: 'Tail latency',
    sloTTFT: 200, sloE2EL: 2000,
    rows: [
      { ttft: 40,  e2el: 900,  tokens: 90  },
      { ttft: 45,  e2el: 850,  tokens: 85  },
      { ttft: 38,  e2el: 920,  tokens: 92  },
      { ttft: 42,  e2el: 880,  tokens: 88  },
      { ttft: 850, e2el: 4200, tokens: 420 },
      { ttft: 780, e2el: 3800, tokens: 380 },
    ],
  },
  {
    label: 'Streaming app',
    sloTTFT: 100, sloE2EL: 2500,
    rows: [
      { ttft: 30, e2el: 1500, tokens: 150 },
      { ttft: 25, e2el: 2200, tokens: 220 },
      { ttft: 35, e2el: 900,  tokens: 90  },
      { ttft: 28, e2el: 1800, tokens: 180 },
      { ttft: 40, e2el: 1200, tokens: 120 },
      { ttft: 32, e2el: 2800, tokens: 280 },
    ],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

let nextId = 100

export default function LatencyMetrics() {
  const [preset,       setPreset]      = useState('Mixed workload')
  const [singleTTFT,   setSingleTTFT]  = useState(80)
  const [singleE2EL,   setSingleE2EL]  = useState(2200)
  const [singleTokens, setSingleTokens]= useState(220)
  const [rows,         setRows]        = useState<Request[]>(
    PRESETS[1].rows!.map((r, i) => ({ ...r, id: i + 1 }))
  )
  const [sloTTFT, setSloTTFT] = useState(200)
  const [sloE2EL, setSloE2EL] = useState(3000)

  // ── Single request ──────────────────────────────────────────────────────────

  const singleTGT  = Math.max(0, singleE2EL - singleTTFT)                   // token gen time
  const singleTPOT = singleTokens > 1 ? singleTGT / (singleTokens - 1) : 0 // ms/token

  // ── Handlers ────────────────────────────────────────────────────────────────

  function loadPreset(label: string) {
    const p = PRESETS.find(x => x.label === label)
    if (!p) return
    setPreset(label)
    if (p.rows) setRows(p.rows.map((r, i) => ({ ...r, id: i + 1 })))
    setSloTTFT(p.sloTTFT)
    setSloE2EL(p.sloE2EL)
  }

  function updateRow(id: number, field: keyof PresetRows[0], raw: string) {
    const value = Math.max(field === 'tokens' ? 2 : 0, Number(raw) || 0)
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    setPreset('Custom')
  }

  function addRow() {
    setRows(prev => [...prev, { id: nextId++, ttft: 100, e2el: 1000, tokens: 100 }])
    setPreset('Custom')
  }

  function removeRow(id: number) {
    setRows(prev => prev.filter(r => r.id !== id))
    setPreset('Custom')
  }

  const goodputCount = rows.filter(r => r.ttft <= sloTTFT && r.e2el <= sloE2EL).length
  const goodputPct   = rows.length > 0 ? (goodputCount / rows.length) * 100 : 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Latency Metrics Playground</div>
        <div className={styles.headerDesc}>
        Simulate inference workloads and see how latency affects TPOT and SLO-based goodput
        </div>
      </div>

      <div className={styles.body}>

        {/* ══════════════════════════════════════════════════════════
            Single request
            ══════════════════════════════════════════════════════════ */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Single request</div>
          <div className={styles.singleLayout}>

            {/* Inputs */}
            <div className={styles.inputs}>
              <SliderRow
                label="TTFT" unit="ms"
                min={0} max={2000} step={10}
                value={singleTTFT} onChange={setSingleTTFT}
              />
              <SliderRow
                label="E2EL" unit="ms"
                min={0} max={10000} step={50}
                value={singleE2EL} onChange={setSingleE2EL}
              />
              {singleE2EL < singleTTFT && (
                <div className={styles.inlineWarn}>E2EL must be ≥ TTFT</div>
              )}
              <SliderRow
                label="Output tokens" unit=""
                min={2} max={500} step={1}
                value={singleTokens} onChange={setSingleTokens}
              />
            </div>

            {/* Results */}
            <div className={styles.singleResults}>
              <div className={styles.metricCards}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Token Gen Time</div>
                  <div className={styles.metricValue}>
                    {singleTGT.toFixed(0)}<span className={styles.metricUnit}> ms</span>
                  </div>
                  <div className={styles.metricHint}>E2EL − TTFT</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>TPOT</div>
                  <div className={styles.metricValue}>
                    {singleTPOT.toFixed(2)}<span className={styles.metricUnit}> ms/tok</span>
                  </div>
                  <div className={styles.metricHint}>Token Gen Time ÷ (N−1)</div>
                </div>
              </div>
              <div className={styles.formulaBox}>
                <div className={styles.formulaLine}>
                  Token Gen Time = {singleE2EL} − {singleTTFT} = <strong>{singleTGT}</strong> ms
                </div>
                <div className={styles.formulaLine}>
                  TPOT = {singleTGT} ÷ ({singleTokens} − 1) = <strong>{singleTPOT.toFixed(2)}</strong> ms/token
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            Sample requests table
            ══════════════════════════════════════════════════════════ */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>Sample requests</div>
            <div className={styles.presets}>
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  type="button"
                  className={`${styles.presetBtn} ${preset === p.label ? styles.presetActive : ''}`}
                  onClick={() => loadPreset(p.label)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Req</th>
                  <th>TTFT (ms)</th>
                  <th>E2EL (ms)</th>
                  <th>Output tokens</th>
                  <th>TPOT (ms/tok)</th>
                  <th>SLO</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const tpot      = row.tokens > 1 ? Math.max(0, row.e2el - row.ttft) / (row.tokens - 1) : 0
                  const passes    = row.ttft <= sloTTFT && row.e2el <= sloE2EL
                  const e2elInvalid = row.e2el < row.ttft
                  return (
                    <tr key={row.id}>
                      <td className={styles.reqLabel}>R{i + 1}</td>
                      <td>
                        <input
                          type="number" className={styles.cellInput}
                          value={row.ttft}
                          onChange={e => updateRow(row.id, 'ttft', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className={`${styles.cellInput} ${e2elInvalid ? styles.cellInputWarn : ''}`}
                          value={row.e2el}
                          onChange={e => updateRow(row.id, 'e2el', e.target.value)}
                          title={e2elInvalid ? 'E2EL must be ≥ TTFT' : undefined}
                        />
                      </td>
                      <td>
                        <input
                          type="number" className={styles.cellInput}
                          value={row.tokens}
                          onChange={e => updateRow(row.id, 'tokens', e.target.value)}
                        />
                      </td>
                      <td className={styles.computed}>{tpot.toFixed(2)}</td>
                      <td className={passes ? styles.sloPass : styles.sloFail}>
                        {passes ? '✓' : '✗'}
                      </td>
                      <td>
                        <button
                          type="button" className={styles.removeBtn}
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length <= 1}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <button type="button" className={styles.addBtn} onClick={addRow}>
            + Add request
          </button>

          {/* SLO config */}
          <div className={styles.sloRow}>
            <span className={styles.sloLabel}>SLO constraints:</span>
            <span className={styles.sloField}>
              TTFT ≤
              <input
                type="number" className={styles.sloInput}
                value={sloTTFT}
                onChange={e => { setSloTTFT(Math.max(0, Number(e.target.value))); setPreset('Custom') }}
              />
              ms
            </span>
            <span className={styles.sloField}>
              E2EL ≤
              <input
                type="number" className={styles.sloInput}
                value={sloE2EL}
                onChange={e => { setSloE2EL(Math.max(0, Number(e.target.value))); setPreset('Custom') }}
              />
              ms
            </span>
          </div>

          {/* Goodput */}
          {rows.length > 0 && (
            <div className={styles.goodputBox}>
              <div className={styles.goodputLabel}>Goodput</div>
              <div className={styles.goodputValue}>
                <span
                  className={styles.goodputNum}
                  style={{ color: goodputPct === 100 ? '#15803d' : goodputPct >= 50 ? '#d97706' : '#dc2626' }}
                >
                  {goodputCount}/{rows.length}
                </span>
                <span className={styles.goodputText}>
                  requests meet all SLO constraints ({goodputPct.toFixed(0)}%)
                </span>
              </div>
              <div className={styles.goodputBar}>
                <div
                  className={styles.goodputFill}
                  style={{
                    width: `${goodputPct}%`,
                    background: goodputPct === 100 ? '#22c55e' : goodputPct >= 50 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <div className={styles.goodputNote}>
                SLO: TTFT ≤ {sloTTFT} ms and E2EL ≤ {sloE2EL} ms. Adjust the thresholds above to see how goodput changes.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── SliderRow sub-component ────────────────────────────────────────────────────

function SliderRow({
  label, unit, min, max, step, value, onChange,
}: {
  label: string; unit: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void;
}) {
  return (
    <div className={styles.sliderRow}>
      <label className={styles.sliderLabel}>{label}</label>
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={styles.slider}
      />
      <input
        type="number"
        className={styles.numInput}
        value={value}
        onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
      />
      {unit && <span className={styles.unit}>{unit}</span>}
    </div>
  )
}
