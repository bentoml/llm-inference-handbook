import { useState } from 'react'
import styles from './styles.module.css'

// ── Types ────────────────────────────────────────────────────────────────────

type HoverLevel = 'thread' | 'warp' | 'block' | 'sm' | 'l2' | 'hbm' | null

// 32 threads per warp — show all of them
const WARP_THREADS = Array.from({ length: 32 }, (_, i) => i)

// ── Component ───────────────────────────────────────────────────────────────

export default function GPUExecutionVisualizer() {
  const [hover, setHover] = useState<HoverLevel>(null)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>GPU Execution and Memory Map</div>
        <div className={styles.headerDesc}>
          Understand how work is organized and where data lives, from individual threads
          up to global memory. Hover over any section to highlight it.
        </div>
      </div>

      <div className={styles.body}>
        {/* ── Legend ── */}
        <div className={styles.legend}>
          <button
            type="button"
            className={`${styles.legendItem} ${hover === 'thread' ? styles.legendActive : ''}`}
            onMouseEnter={() => setHover('thread')}
            onMouseLeave={() => setHover(null)}
          >
            <span className={styles.legendDot} style={{ background: '#16a34a' }} />
            Thread
          </button>
          <span className={styles.legendArrow}>&rarr;</span>
          <button
            type="button"
            className={`${styles.legendItem} ${hover === 'warp' ? styles.legendActive : ''}`}
            onMouseEnter={() => setHover('warp')}
            onMouseLeave={() => setHover(null)}
          >
            <span className={styles.legendDot} style={{ background: '#059669' }} />
            Warp (32 threads)
          </button>
          <span className={styles.legendArrow}>&rarr;</span>
          <button
            type="button"
            className={`${styles.legendItem} ${hover === 'block' ? styles.legendActive : ''}`}
            onMouseEnter={() => setHover('block')}
            onMouseLeave={() => setHover(null)}
          >
            <span className={styles.legendDot} style={{ background: '#2563eb' }} />
            Block
          </button>
          <span className={styles.legendArrow}>&rarr;</span>
          <button
            type="button"
            className={`${styles.legendItem} ${hover === 'sm' ? styles.legendActive : ''}`}
            onMouseEnter={() => setHover('sm')}
            onMouseLeave={() => setHover(null)}
          >
            <span className={styles.legendDot} style={{ background: '#6d28d9' }} />
            SM
          </button>
        </div>

        {/* ── Main diagram ── */}
        <div className={styles.diagram}>
          {/* On-chip: die boundary */}
          <div className={styles.die}>
            <div className={styles.dieLabel}>
              <span className={styles.dieLabelChip}>On-chip</span>
              GPU die
            </div>

            {/* SMs row */}
            <div className={styles.smsRow}>
              {/* SM 0 — expanded with full detail */}
              <div
                className={`${styles.sm} ${hover === 'sm' ? styles.smHighlight : ''}`}
                onMouseEnter={() => setHover('sm')}
                onMouseLeave={() => setHover(null)}
              >
                <div className={styles.smHeader}>
                  <span className={styles.smTitle}>SM 0</span>
                  <span className={styles.smBadge}>core compute unit</span>
                </div>

                {/* Block 0 — fully expanded */}
                <div
                  className={`${styles.block} ${hover === 'block' ? styles.blockHighlight : ''}`}
                  onMouseEnter={() => setHover('block')}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className={styles.blockHeader}>Thread Block 0</div>

                  {/* Warp 0 — show all 32 threads */}
                  <div
                    className={`${styles.warp} ${hover === 'warp' ? styles.warpHighlight : ''}`}
                    onMouseEnter={() => setHover('warp')}
                    onMouseLeave={() => setHover(null)}
                  >
                    <div className={styles.warpHeader}>
                      <span className={styles.warpTitle}>Warp 0</span>
                      <span className={styles.warpMeta}>32 threads, lockstep</span>
                    </div>
                    <div className={styles.threadGrid}>
                      {WARP_THREADS.map((t) => (
                        <div
                          key={t}
                          className={`${styles.threadCell} ${hover === 'thread' ? styles.threadHighlight : ''}`}
                          onMouseEnter={() => setHover('thread')}
                          onMouseLeave={() => setHover(null)}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warp 1 — collapsed */}
                  <div className={`${styles.warpCollapsed} ${hover === 'warp' ? styles.warpHighlight : ''}`}>
                    <span className={styles.warpTitle}>Warp 1</span>
                    <span className={styles.warpMeta}>32 threads</span>
                  </div>

                  {/* More warps indicator */}
                  <div className={styles.moreIndicator}>
                    &#8942; up to 32 warps (1024 threads max)
                  </div>
                </div>

                {/* Block 1 — collapsed */}
                <div className={`${styles.blockCollapsed} ${hover === 'block' ? styles.blockHighlight : ''}`}>
                  <span className={styles.blockCollapsedTitle}>Thread Block 1</span>
                  <span className={styles.blockCollapsedNote}>Runs on the same SM</span>
                </div>

                {/* SM resources */}
                <div className={styles.smResources}>
                  <div className={styles.resourceCard}>
                    <div className={styles.resourceTitle}>Register file</div>
                    <div className={styles.resourceMeta}>256 KB &middot; private per thread</div>
                  </div>
                  <div className={styles.resourceCard}>
                    <div className={styles.resourceTitle}>Shared memory</div>
                    <div className={styles.resourceMeta}>per block &middot; programmer-managed</div>
                  </div>
                  <div className={styles.resourceCard}>
                    <div className={styles.resourceTitle}>L1 cache</div>
                    <div className={styles.resourceMeta}>per SM &middot; hardware-managed</div>
                  </div>
                  <div className={styles.resourceCard}>
                    <div className={styles.resourceTitle}>Warp schedulers</div>
                    <div className={styles.resourceMeta}>issue ready warps each cycle</div>
                  </div>
                </div>
              </div>

              {/* SM 1–3 — compact */}
              <div className={styles.compactSMsColumn}>
                {[
                  { id: 1, block: 2, note: '' },
                  { id: 2, block: 3, note: '' },
                  { id: 3, block: 4, note: '' },
                ].map((sm) => (
                  <div
                    key={sm.id}
                    className={`${styles.sm} ${styles.smCompact} ${hover === 'sm' ? styles.smHighlight : ''}`}
                  >
                    <div className={styles.smHeader}>
                      <span className={styles.smTitle}>SM {sm.id}</span>
                    </div>
                    <div className={`${styles.blockCollapsed} ${hover === 'block' ? styles.blockHighlight : ''}`}>
                      <span className={styles.blockCollapsedTitle}>Thread Block {sm.block}</span>
                      {sm.note && <span className={styles.blockCollapsedNote}>{sm.note}</span>}
                    </div>
                    <div className={styles.smResourcesCompact}>
                      Registers &middot; Shared mem &middot; L1 &middot; Schedulers
                    </div>
                  </div>
                ))}
              </div>

              {/* More SMs */}
              <div className={styles.moreSMs}>
                <div className={styles.moreSMsDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.moreSMsLabel}>
                  up to 132 SMs<br />(H100 SXM)
                </div>
              </div>
            </div>

            {/* L2 cache — spanning full die width */}
            <div
              className={`${styles.l2} ${hover === 'l2' ? styles.l2Highlight : ''}`}
              onMouseEnter={() => setHover('l2')}
              onMouseLeave={() => setHover(null)}
            >
              <span className={styles.l2Title}>L2 Cache</span>
              <span className={styles.l2Meta}>50 MB &middot; shared across all SMs &middot; hardware-managed</span>
            </div>
          </div>

          {/* Bus separator */}
          <div className={styles.busSeparator}>
            <div className={styles.busLine} />
            <div className={styles.busTag}>
              <span className={styles.busIcon}>{'\u2195'}</span>
              memory bus
            </div>
            <div className={styles.busLine} />
          </div>

          {/* Off-chip: HBM */}
          <div
            className={`${styles.hbm} ${hover === 'hbm' ? styles.hbmHighlight : ''}`}
            onMouseEnter={() => setHover('hbm')}
            onMouseLeave={() => setHover(null)}
          >
            <div className={styles.hbmHeader}>
              <div>
                <span className={styles.dieLabelChip} style={{ background: '#fed7aa', color: '#9a3412' }}>Off-chip</span>
                <span className={styles.hbmTitle}>HBM (Global Memory / VRAM)</span>
              </div>
              <span className={styles.hbmSpec}>80 GB &middot; 3.35 TB/s (H100 SXM)</span>
            </div>
            <div className={styles.hbmItems}>
              <div className={styles.hbmItem}>Model weights</div>
              <div className={styles.hbmItem}>KV cache</div>
              <div className={styles.hbmItem}>Activations</div>
              <div className={styles.hbmItem}>Intermediate buffers</div>
            </div>
            <div className={styles.hbmNote}>
              Largest but slowest. ~400+ cycle access latency. Kernel optimization
              focuses on minimizing round-trips here.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
