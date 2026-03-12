import { useState, useMemo } from 'react'
import FormItem from '../FormItem'
import styles from './styles.module.css'

const MODEL_PRESETS = [
  { label: 'Custom', params: null as number | null },
  { label: 'Llama 3.2 3B', params: 3 },
  { label: 'Llama 3.1 8B', params: 8 },
  { label: 'Qwen2.5 32B', params: 32 },
  { label: 'Llama 3.3 70B', params: 70 },
  { label: 'Llama 3.1 405B', params: 405 },
  { label: 'DeepSeek V3 671B', params: 671 }
]

// Representative GPU configs with unique VRAM tiers
const GPU_CONFIGS = [
  { name: 'NVIDIA L4 / A10G', vram: 24 },
  { name: 'NVIDIA A100 40GB', vram: 40 },
  { name: 'NVIDIA L40S', vram: 48 },
  { name: 'NVIDIA A100 / H100 (80GB)', vram: 80 },
  { name: 'NVIDIA H200 SXM', vram: 141 },
  { name: 'NVIDIA B200', vram: 192 }
]

const GPU_COUNTS = [1, 2, 4, 8] as const

function GPUMemoryCalculator() {
  const [preset, setPreset] = useState('Llama 3.1 8B')
  const [params, setParams] = useState(8)
  const [precision, setPrecision] = useState(16)
  const [overhead, setOverhead] = useState(20)

  const requiredMemory = useMemo(() => {
    return params * (precision / 8) * (1 + overhead / 100)
  }, [params, precision, overhead])

  // For each GPU count tier, find the most frugal GPU (smallest VRAM) that fits
  const gpuRecommendations = useMemo(() => {
    const result: { count: number; name: string; vram: number }[] = []
    for (const count of GPU_COUNTS) {
      const fitting = GPU_CONFIGS.filter(
        (gpu) => gpu.vram * count >= requiredMemory
      )
      if (fitting.length === 0) continue
      const best = fitting.reduce((a, b) => (a.vram <= b.vram ? a : b))
      // Skip if a lower count already achieves the same VRAM total or better
      const prev = result[result.length - 1]
      if (prev && prev.vram * prev.count <= best.vram * count) continue
      result.push({ count, ...best })
    }
    return result
  }, [requiredMemory])

  function handlePresetChange(label: string) {
    const found = MODEL_PRESETS.find((p) => p.label === label)
    if (!found) return
    setPreset(label)
    if (found.params !== null) setParams(found.params)
  }

  function handleParamsChange(val: number) {
    setParams(val)
    setPreset('Custom')
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.headerIcon} />
          <span>GPU Memory Calculator</span>
        </div>
        <div className={styles.headerDescription}>
          Estimate the GPU memory (VRAM) required to load and run an LLM
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.presetSelector}>
          <span className={styles.presetLabel}>Quick preset:</span>
          <div className={styles.presetList}>
            {MODEL_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={
                  preset === p.label ? styles.presetActive : undefined
                }
                onClick={() => handlePresetChange(p.label)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.bodyContent}>
          <div className={styles.input}>
            <div className={styles.title}>Model Parameters</div>
            <FormItem
              title="Parameters (P)"
              description="Total number of model parameters in billions (e.g., 8 for a 8B model)"
            >
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={params}
                onChange={(e) => handleParamsChange(Number(e.target.value))}
              />
            </FormItem>
            <FormItem
              title="Bit Precision (Q)"
              description="Numeric format used for model weights. Lower precision reduces memory but may reduce accuracy."
            >
              <select
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
              >
                <option value={32}>FP32 (32-bit)</option>
                <option value={16}>FP16 / BF16 (16-bit)</option>
                <option value={8}>FP8 / INT8 (8-bit)</option>
                <option value={4}>INT4 / FP4 (4-bit)</option>
              </select>
            </FormItem>
            <FormItem
              title="Overhead (%)"
              note="Typical range: 10–30%. Covers KV cache, activations, and framework buffers."
              description="Additional memory beyond model weights"
            >
              <input
                type="number"
                step="1"
                min="0"
                max="200"
                value={overhead}
                onChange={(e) => setOverhead(Number(e.target.value))}
              />
            </FormItem>
          </div>
          <div className={styles.output}>
            <div className={styles.result}>
              Required VRAM: <span>{requiredMemory.toFixed(1)} GB</span>
            </div>
            <div className={styles.description}>
              Estimated GPU memory to load and run this model at the chosen
              precision.
            </div>
            <div className={styles.formula}>
              <div className={styles.label}>Formula:</div>
              <div className={styles.code}>
                Memory (GB) = P × (Q / 8) × (1 + Overhead)
              </div>
              <div className={styles.code}>
                = {params} × ({precision} / 8) × (1 + {overhead / 100}) ={' '}
                {requiredMemory.toFixed(2)} GB
              </div>
            </div>
            <div className={styles.gpuSection}>
              <div className={styles.gpuSectionLabel}>
                Example GPU configs with enough VRAM:
              </div>
              {gpuRecommendations.length > 0 ? (
                <div className={styles.gpuGrid}>
                  {gpuRecommendations.map((gpu) => (
                    <div
                      key={`${gpu.count}-${gpu.name}`}
                      className={`${styles.gpuCard} ${
                        gpu.count === 1
                          ? styles.gpuCard1
                          : gpu.count === 2
                            ? styles.gpuCard2
                            : gpu.count === 4
                              ? styles.gpuCard4
                              : styles.gpuCard8
                      }`}
                    >
                      <span className={styles.gpuCount}>{gpu.count}×</span>
                      <div className={styles.gpuInfo}>
                        <span className={styles.gpuName}>{gpu.name}</span>
                        <span className={styles.gpuVram}>
                          {gpu.vram} GB VRAM each
                        </span>
                      </div>
                      <span className={styles.gpuTotal}>
                        {gpu.vram * gpu.count} GB total
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noGpu}>
                  No configuration with up to 8 GPUs fits this model at the
                  current precision. Consider using lower precision (e.g.,
                  INT4).
                </div>
              )}
            </div>
            <div className={styles.note}>
              <div className={styles.label}>Note:</div>
              <div>
                This estimate covers model weights plus the specified overhead.
                Actual usage varies with batch size, sequence length, and
                inference framework. Always benchmark on your target hardware.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GPUMemoryCalculator
