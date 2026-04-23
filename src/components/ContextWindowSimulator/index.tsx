import { useState, useRef } from 'react'
import styles from './styles.module.css'

type ModelKey = '8K' | '32K' | '128K'

const MODELS: Record<ModelKey, { label: string; max: number }> = {
  '8K':   { label: '8K',   max: 8_000 },
  '32K':  { label: '32K',  max: 32_000 },
  '128K': { label: '128K', max: 128_000 },
}

type Role = 'user' | 'assistant'

interface Turn {
  id: number
  role: Role
  tokens: number
  text: string
  roundIdx: number
}

// Scripted conversation, all about context windows.
// Token counts are fixed and realistic (padded to simulate longer real messages).
const SCRIPT: Array<{ user: { text: string; tokens: number }; assistant: { text: string; tokens: number } }> = [
  {
    user:      { text: 'What is a context window in an LLM?', tokens: 12 },
    assistant: { text: 'The context window is the maximum number of tokens the model can process in a single request — your system prompt, the full conversation history, and the new user message all count against it. Typical sizes today are 8K, 32K, or 128K tokens.', tokens: 520 },
  },
  {
    user:      { text: 'Do older messages get forgotten between turns?', tokens: 14 },
    assistant: { text: 'LLMs have no memory between API calls. Every turn, the client re-sends the entire prior conversation so the model can “see” the full thread again. Once the combined input exceeds the window, the oldest messages must be dropped.', tokens: 640 },
  },
  {
    user:      { text: 'Why do long chats start to feel slower?', tokens: 13 },
    assistant: { text: 'Each new turn re-processes every earlier token through the prefill phase. More input tokens mean more compute, higher time-to-first-token, and a larger KV cache, so latency climbs as the chat grows.', tokens: 700 },
  },
  {
    user:      { text: 'How can I avoid hitting the context limit?', tokens: 12 },
    assistant: { text: 'Summarize or drop old turns before re-sending, use prefix caching so the prior KV is not recomputed, or move to a model with a larger window, though larger windows cost more per request.', tokens: 580 },
  },
  {
    user:      { text: 'What happens if a request exceeds the window?', tokens: 13 },
    assistant: { text: 'Most APIs either return an error or silently truncate the oldest tokens. Either way, earlier context is lost, so the model may contradict itself or forget facts it previously agreed on.', tokens: 520 },
  },
  {
    user:      { text: 'Is a bigger context window always better?', tokens: 11 },
    assistant: { text: 'Not always. Larger windows raise prefill latency and cost, and models often attend less accurately to content in the middle of very long inputs. Right-size the window to the workload.', tokens: 600 },
  },
  {
    user:      { text: 'Does streaming help with very long inputs?', tokens: 12 },
    assistant: { text: 'Streaming only affects how the output is delivered. The prefill cost of a long input is unchanged, so you still pay full TTFT for every token in the prompt before the first output token appears.', tokens: 560 },
  },
  {
    user:      { text: 'Can KV cache offloading help with long context?', tokens: 13 },
    assistant: { text: 'Yes. Offloading spills cold KV blocks from GPU to CPU or disk, trading a small retrieval latency for much more concurrency on long-context requests — useful when GPU memory is the bottleneck.', tokens: 620 },
  },
]

export default function ContextWindowSimulator() {
  const [modelKey, setModelKey] = useState<ModelKey>('32K')
  const [turns, setTurns] = useState<Turn[]>([])
  const nextId = useRef(1)

  const max = MODELS[modelKey].max
  const total = turns.reduce((s, t) => s + t.tokens, 0)
  const pct = Math.min(100, (total / max) * 100)

  const overflow = Math.max(0, total - max)
  const truncatedIds = new Set<number>()
  if (overflow > 0) {
    let toDrop = overflow
    for (const t of turns) {
      if (toDrop <= 0) break
      truncatedIds.add(t.id)
      toDrop -= t.tokens
    }
  }

  const state: 'ok' | 'warn' | 'danger' | 'full' =
    pct >= 100 ? 'full' : pct >= 95 ? 'danger' : pct >= 75 ? 'warn' : 'ok'

  const roundNum = Math.floor(turns.length / 2) // completed rounds
  const canAdd = roundNum < SCRIPT.length
  const latestRound = roundNum // latest added round (1-indexed via +1 when displayed)

  function addTurn() {
    if (!canAdd) return
    const round = SCRIPT[roundNum]
    const id1 = nextId.current++
    const id2 = nextId.current++
    const newRoundIdx = roundNum + 1
    setTurns(ts => [
      ...ts,
      { id: id1, role: 'user',      tokens: round.user.tokens,      text: round.user.text,      roundIdx: newRoundIdx },
      { id: id2, role: 'assistant', tokens: round.assistant.tokens, text: round.assistant.text, roundIdx: newRoundIdx },
    ])
  }

  function reset() {
    nextId.current = 1
    setTurns([])
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Context window simulator</div>
        <div className={styles.headerDesc}>
          Every turn, the full conversation is re-sent to the model. Watch the window fill up.
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.presets}>
          {(Object.keys(MODELS) as ModelKey[]).map(k => (
            <button
              key={k}
              className={`${styles.preset} ${modelKey === k ? styles.presetActive : ''}`}
              onClick={() => setModelKey(k)}
            >
              {MODELS[k].label}
            </button>
          ))}
          <div className={styles.presetHint}>Model context size</div>
        </div>

        <div className={styles.grid}>
          {/* Left — input sent to the model this turn */}
          <div className={styles.convoCol}>
            <div className={styles.colLabel}>
              Input to the model {latestRound > 0 ? `— round ${latestRound}` : ''}
            </div>
            <div className={styles.subLabel}>
              All prior messages are re-sent every round.
            </div>
            <div className={styles.convo}>
              {turns.length === 0 && (
                <div className={styles.emptyState}>
                  Click <strong>+ Add turn</strong> to start the conversation.
                </div>
              )}
              {turns.map(t => {
                const isNew = t.roundIdx === latestRound
                const isTruncated = truncatedIds.has(t.id)
                return (
                  <div
                    key={t.id}
                    className={`${styles.bubble} ${styles[t.role]} ${
                      isTruncated ? styles.truncated : ''
                    } ${isNew ? styles.newBubble : ''}`}
                  >
                    <div className={styles.bubbleHead}>
                      <span className={styles.bubbleRole}>
                        {t.role === 'user' ? 'User' : 'Assistant'}
                        <span className={styles.roundTag}> · round {t.roundIdx}</span>
                      </span>
                      <span className={styles.bubbleMeta}>
                        {isNew ? (
                          <span className={styles.newBadge}>
                            NEW in round {latestRound}
                          </span>
                        ) : (
                          <span className={styles.resentBadge}>
                            re-sent in round {latestRound}
                          </span>
                        )}
                        <span className={styles.bubbleTokens}>
                          {t.tokens.toLocaleString()} tok
                        </span>
                      </span>
                    </div>
                    <div className={styles.bubbleText}>{t.text}</div>
                  </div>
                )
              })}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={addTurn}
                disabled={!canAdd}
              >
                {canAdd ? '+ Add turn' : 'End of conversation'}
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={reset}
                disabled={turns.length === 0}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right — token usage */}
          <div className={styles.usageCol}>
            <div className={styles.colLabel}>Token usage</div>

            <div className={styles.bigNum}>
              <span className={styles[`num_${state}`]}>
                {total.toLocaleString()}
              </span>
              <span className={styles.numMax}> / {max.toLocaleString()}</span>
            </div>
            <div className={styles.pctRow}>
              <span className={styles[`pct_${state}`]}>{pct.toFixed(0)}%</span>
              <span className={styles.pctLabel}>of context used</span>
            </div>

            <div className={styles.track}>
              <div
                className={`${styles.fill} ${styles[`fill_${state}`]}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {state === 'ok' && turns.length === 0 && (
              <div className={styles.caption}>
                Pick a model size, then add turns to see the input grow.
              </div>
            )}
            {state === 'ok' && turns.length > 0 && (
              <div className={styles.caption}>
                Every new turn re-sends the full prior conversation.
              </div>
            )}
            {state === 'warn' && (
              <div className={`${styles.caption} ${styles.captionWarn}`}>
                Filling up — long chats will hit the limit soon.
              </div>
            )}
            {state === 'danger' && (
              <div className={`${styles.caption} ${styles.captionDanger}`}>
                Nearly full — one more turn may overflow.
              </div>
            )}
            {state === 'full' && (
              <div className={`${styles.caption} ${styles.captionDanger}`}>
                Context full — oldest turns dropped to fit.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
