import { useState } from 'react';
import styles from './styles.module.css';

type UseCase = {
  id: string;
  label: string;
  temperature: [number, number];
  topP: [number, number];
  maxTokens: [number, number];
  maxTokensLabel: string;
  notes: string;
};

const USE_CASES: UseCase[] = [
  {
    id: 'classification',
    label: 'Classification',
    temperature: [0.0, 0.2],
    topP: [1.0, 1.0],
    maxTokens: [0, 50],
    maxTokensLabel: 'Small (<50)',
    notes: 'Prefer deterministic output.',
  },
  {
    id: 'extraction',
    label: 'Extraction',
    temperature: [0.0, 0.2],
    topP: [1.0, 1.0],
    maxTokens: [0, 100],
    maxTokensLabel: 'Small (<100)',
    notes: 'Minimize variation and formatting drift.',
  },
  {
    id: 'rag',
    label: 'RAG / QA',
    temperature: [0.1, 0.5],
    topP: [0.9, 1.0],
    maxTokens: [200, 800],
    maxTokensLabel: 'Moderate (~200–800)',
    notes: 'Lower randomness may reduce hallucinations.',
  },
  {
    id: 'chat',
    label: 'Chat',
    temperature: [0.5, 0.8],
    topP: [0.9, 1.0],
    maxTokens: [200, 1000],
    maxTokensLabel: 'Moderate (~200–1000)',
    notes: 'Balanced stability and variation.',
  },
  {
    id: 'summarization',
    label: 'Summarization',
    temperature: [0.2, 0.7],
    topP: [0.9, 1.0],
    maxTokens: [200, 800],
    maxTokensLabel: 'Moderate (~200–800)',
    notes: 'Tune by how extractive vs. creative the summary should be.',
  },
  {
    id: 'code',
    label: 'Code generation',
    temperature: [0.0, 0.3],
    topP: [1.0, 1.0],
    maxTokens: [500, 2000],
    maxTokensLabel: 'Moderate–Large (~500–2000)',
    notes: 'Lower temperature usually improves syntax stability.',
  },
  {
    id: 'brainstorming',
    label: 'Brainstorming',
    temperature: [0.7, 1.2],
    topP: [0.9, 0.95],
    maxTokens: [500, 2000],
    maxTokensLabel: 'Moderate–Large (~500–2000)',
    notes: 'Encourage more diverse outputs.',
  },
  {
    id: 'creative',
    label: 'Creative writing',
    temperature: [0.8, 1.3],
    topP: [0.9, 0.95],
    maxTokens: [1500, 3500],
    maxTokensLabel: 'Large (1500+)',
    notes: 'Higher diversity, but also higher instability.',
  },
];

function formatRange([a, b]: [number, number], digits: number): string {
  if (a === b) return a.toFixed(digits);
  return `${a.toFixed(digits)}–${b.toFixed(digits)}`;
}

type RangeRowProps = {
  label: string;
  scaleMin: number;
  scaleMax: number;
  range: [number, number];
  rangeLabel: string;
  ticks: string[];
};

function RangeRow({
  label,
  scaleMin,
  scaleMax,
  range,
  rangeLabel,
  ticks,
}: RangeRowProps) {
  const span = scaleMax - scaleMin;
  const leftPct = ((range[0] - scaleMin) / span) * 100;
  const widthPct = Math.max(1.2, ((range[1] - range[0]) / span) * 100);

  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowValue}>{rangeLabel}</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <div className={styles.tickRow}>
        {ticks.map((t) => (
          <span key={t} className={styles.tick}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function UseCasePresets() {
  const [activeId, setActiveId] = useState('chat');
  const active = USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Inference Parameter Preset Explorer</div>
        <div className={styles.headerDesc}>
          Pick a use case to see typical temperature, top-p, and max_tokens
          ranges.
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.chips}>
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              className={uc.id === activeId ? styles.chipActive : styles.chip}
              onClick={() => setActiveId(uc.id)}
            >
              {uc.label}
            </button>
          ))}
        </div>
        <RangeRow
          label="Temperature"
          scaleMin={0}
          scaleMax={2}
          range={active.temperature}
          rangeLabel={formatRange(active.temperature, 1)}
          ticks={['0', '1.0', '2.0']}
        />
        <RangeRow
          label="top-p"
          scaleMin={0}
          scaleMax={1}
          range={active.topP}
          rangeLabel={formatRange(active.topP, 2)}
          ticks={['0', '0.5', '1.0']}
        />
        <RangeRow
          label="max_tokens"
          scaleMin={0}
          scaleMax={3500}
          range={active.maxTokens}
          rangeLabel={active.maxTokensLabel}
          ticks={['Small', 'Moderate', 'Large']}
        />
        <div className={styles.notes}>{active.notes}</div>
      </div>
    </div>
  );
}
