import { useState } from 'react';
import styles from './styles.module.css';

type Preset = 'peaky' | 'mixed' | 'flat';

type TokenProb = { token: string; prob: number };

type Distribution = {
  label: string;
  prompt: string;
  tokens: TokenProb[];
};

const DISTRIBUTIONS: Record<Preset, Distribution> = {
  peaky: {
    label: 'Peaky',
    prompt: '"The capital of France is"',
    tokens: [
      { token: 'Paris', prob: 0.85 },
      { token: 'the', prob: 0.05 },
      { token: 'a', prob: 0.03 },
      { token: 'located', prob: 0.02 },
      { token: 'home', prob: 0.02 },
      { token: 'known', prob: 0.01 },
      { token: 'in', prob: 0.01 },
      { token: 'famous', prob: 0.01 },
    ],
  },
  mixed: {
    label: 'Mixed',
    prompt: '"I love eating"',
    tokens: [
      { token: 'pizza', prob: 0.22 },
      { token: 'sushi', prob: 0.17 },
      { token: 'pasta', prob: 0.14 },
      { token: 'spicy', prob: 0.11 },
      { token: 'ice', prob: 0.10 },
      { token: 'bread', prob: 0.10 },
      { token: 'fruits', prob: 0.08 },
      { token: 'salad', prob: 0.08 },
    ],
  },
  flat: {
    label: 'Flat',
    prompt: '"She walked into the"',
    tokens: [
      { token: 'room', prob: 0.14 },
      { token: 'house', prob: 0.13 },
      { token: 'kitchen', prob: 0.13 },
      { token: 'office', prob: 0.12 },
      { token: 'building', prob: 0.12 },
      { token: 'store', prob: 0.12 },
      { token: 'bar', prob: 0.12 },
      { token: 'garden', prob: 0.12 },
    ],
  },
};

function applyTopP(tokens: TokenProb[], p: number): boolean[] {
  let cumulative = 0;
  const kept: boolean[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (i > 0 && cumulative >= p) {
      kept.push(false);
    } else {
      kept.push(true);
      cumulative += tokens[i].prob;
    }
  }
  return kept;
}

function applyTopK(tokens: TokenProb[], k: number): boolean[] {
  return tokens.map((_, i) => i < k);
}

function summarize(tokens: TokenProb[], kept: boolean[]) {
  const count = kept.filter(Boolean).length;
  const mass = tokens.reduce((sum, t, i) => sum + (kept[i] ? t.prob : 0), 0);
  return { count, mass };
}

type ColumnProps = {
  title: string;
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  tokens: TokenProb[];
  kept: boolean[];
  count: number;
  mass: number;
};

function Column({
  title,
  display,
  min,
  max,
  step,
  value,
  onChange,
  tokens,
  kept,
  count,
  mass,
}: ColumnProps) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>{title}</span>
        <span className={styles.columnValue}>{display}</span>
      </div>
      <input
        type="range"
        aria-label={`${title} filter value`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className={styles.slider}
      />
      <div className={styles.chart}>
        {tokens.map((t, i) => (
          <div className={styles.barRow} key={t.token}>
            <span className={styles.tokenLabel}>{t.token}</span>
            <div className={styles.barTrack}>
              <div
                className={kept[i] ? styles.barKept : styles.barExcluded}
                style={{ width: `${t.prob * 100}%` }}
              />
            </div>
            <span className={styles.probLabel}>
              {(t.prob * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      <div className={styles.caption}>
        {count} of {tokens.length} kept · {(mass * 100).toFixed(0)}% mass
      </div>
    </div>
  );
}

export default function TopPvsTopK() {
  const [preset, setPreset] = useState<Preset>('mixed');
  const [topP, setTopP] = useState(0.9);
  const [topK, setTopK] = useState(3);

  const dist = DISTRIBUTIONS[preset];
  const topPKept = applyTopP(dist.tokens, topP);
  const topKKept = applyTopK(dist.tokens, topK);
  const topPSum = summarize(dist.tokens, topPKept);
  const topKSum = summarize(dist.tokens, topKKept);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Top-p vs top-k</div>
        <div className={styles.headerDesc}>
          Same distribution, different filters. Top-p adapts to the shape; top-k
          doesn't.
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.presets}>
          {(Object.keys(DISTRIBUTIONS) as Preset[]).map((p) => (
            <button
              type="button"
              key={p}
              className={preset === p ? styles.presetActive : styles.preset}
              aria-pressed={preset === p}
              onClick={() => setPreset(p)}
            >
              {DISTRIBUTIONS[p].label}
            </button>
          ))}
        </div>
        <div className={styles.promptCaption}>
          Next token after {dist.prompt}
        </div>
        <div className={styles.columns}>
          <Column
            title="top-p"
            display={topP.toFixed(2)}
            min={0.1}
            max={1.0}
            step={0.05}
            value={topP}
            onChange={setTopP}
            tokens={dist.tokens}
            kept={topPKept}
            count={topPSum.count}
            mass={topPSum.mass}
          />
          <Column
            title="top-k"
            display={String(topK)}
            min={1}
            max={dist.tokens.length}
            step={1}
            value={topK}
            onChange={setTopK}
            tokens={dist.tokens}
            kept={topKKept}
            count={topKSum.count}
            mass={topKSum.mass}
          />
        </div>
      </div>
    </div>
  );
}
