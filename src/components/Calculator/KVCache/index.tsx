import { useState, useMemo } from 'react'
import FormItem from '../FormItem'
import styles from './styles.module.css'

const MODE_OPTIONS = {
  standard: {
    title: 'Standard Calculation',
    default: {
      b: 1,
      s: 1024,
      l: 32,
      h: 32,
      d: 128,
      q: 16
    }
  },
  simplified: {
    title: 'Simplified Calculation',
    default: {
      b: 1,
      s: 2048,
      l: 32,
      hxd: 4096,
      q: 16
    }
  }
}

// We don't want the content here to affect SEO, so all content tags are implemented using div
function KVCacheCalculator() {
  const [data, setData] = useState<
    | {
        type: 'standard'
        b: number // Batch Size (B)
        s: number // Sequence Length (S)
        l: number // Number of Layers (L)
        h: number // Attention Heads (H)
        d: number // Head Dimension (D)
        q: number // Bit Precision (Q)
      }
    | {
        type: 'simplified'
        b: number // Batch Size (B)
        s: number // Sequence Length (S)
        l: number // Number of Layers (L)
        hxd: number // Attention Heads (H) * Head Dimension (D)
        q: number // Bit Precision (Q)
      }
  >({
    type: 'standard',
    ...MODE_OPTIONS.standard.default
  })
  const result = useMemo(() => {
    if (data.type === 'standard') {
      return (
        (2 * data.b * data.s * data.l * data.h * data.d * (data.q / 8)) /
        Math.pow(1024, 3)
      )
    } else {
      return (
        (2 * data.b * data.s * data.l * data.hxd * (data.q / 8)) /
        Math.pow(1024, 3)
      )
    }
  }, [data])

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.headerIcon} />
          <span>KV Cache Memory Calculator</span>
        </div>
        <div className={styles.headerDescription}>
          Calculate the memory required for KV cache in transformer-based LLMs
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.modeSelector}>
          {Object.entries(MODE_OPTIONS).map(([key, value]) => (
            <button
              type="button"
              className={key === data.type ? styles.active : undefined}
              onClick={() => setData({ ...value.default, type: key })}
            >
              {value.title}
            </button>
          ))}
        </div>
        <div className={styles.bodyContent}>
          <div className={styles.input}>
            <div className={styles.title}>Model Parameters</div>
            <FormItem
              title="Batch Size (B)"
              description="Batch size (number of sequences processed in parallel)"
            >
              <input
                type="number"
                step="1"
                min="1"
                value={data.b}
                onChange={(e) =>
                  setData({ ...data, b: Number(e.target.value) })
                }
              />
            </FormItem>
            <FormItem
              title="Sequence Length (S)"
              note="Common values: 1024, 2048, 4096, 8192"
              description="Sequence length (number of tokens per input)"
            >
              <input
                type="number"
                step="1"
                min="1"
                value={data.s}
                onChange={(e) =>
                  setData({ ...data, s: Number(e.target.value) })
                }
              />
            </FormItem>
            <FormItem
              title="Number of Layers (L)"
              description="Number of transformer layers"
            >
              <input
                type="number"
                step="1"
                min="1"
                value={data.l}
                onChange={(e) =>
                  setData({ ...data, l: Number(e.target.value) })
                }
              />
            </FormItem>
            {data.type === 'standard' ? (
              <>
                <FormItem
                  title="Attention Heads (H)"
                  description="Number of attention heads per layer"
                >
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={data.h}
                    onChange={(e) =>
                      setData({ ...data, h: Number(e.target.value) })
                    }
                  />
                </FormItem>
                <FormItem
                  title="Head Dimension (D)"
                  description="Dimension of each attention head"
                >
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={data.d}
                    onChange={(e) =>
                      setData({ ...data, d: Number(e.target.value) })
                    }
                  />
                </FormItem>
              </>
            ) : (
              <FormItem
                title="Model Dimension"
                description="Number of attention heads per layer × Dimension of each attention head"
              >
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={data.hxd}
                  onChange={(e) =>
                    setData({ ...data, d: Number(e.target.value) })
                  }
                />
              </FormItem>
            )}
            <FormItem
              title="Bit Precision (Q)"
              description="Bit precision per value (e.g., 16 for FP16, 32 for FP32), division by 8 converts bits to bytes"
            >
              <select
                value={data.q}
                onChange={(e) =>
                  setData({ ...data, q: Number(e.target.value) })
                }
              >
                <option value={32}>FP32 (32-bit)</option>
                <option value={16}>FP16 (16-bit)</option>
                <option value={8}>INT8 (8-bit)</option>
              </select>
            </FormItem>
          </div>
          <div className={styles.output}>
            <div className={styles.result}>
              KV Cache Size: <span>{result} GB</span>
            </div>
            <div className={styles.description}>
              This is the estimated memory required for storing the key and
              value vectors for all tokens in the sequence.
            </div>
            <div className={styles.formula}>
              <div className={styles.label}>Formula:</div>
              {data.type === 'standard' ? (
                <>
                  <div className={styles.code}>
                    KV Cache Size (GB) = 2 × B × S × L × H × D × (Q / 8) /
                    (1024^3)
                  </div>
                  <div className={styles.code}>
                    = 2 × {data.b} × {data.s} × {data.l} × {data.h} × {data.d} ×
                    ({data.q} / 8) / (1024^3) = {result.toFixed(2)} GB
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.code}>
                    KV Cache Size (GB) = 2 × B × S × L × Model_Dim × (Q / 8) /
                    (1024^3)
                  </div>
                  <div className={styles.code}>
                    = 2 × {data.b} × {data.s} × {data.l} × {data.hxd} × (
                    {data.q} / 8) / (1024^3) = {result.toFixed(2)} GB
                  </div>
                </>
              )}
            </div>
            <div className={styles.note}>
              <div className={styles.label}>Note:</div>
              <div>
                The KV cache size grows linearly with sequence length. For long
                conversations or documents, this can become a significant memory
                bottleneck.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KVCacheCalculator
