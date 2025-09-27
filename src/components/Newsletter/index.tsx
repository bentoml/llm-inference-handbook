import { useState, useCallback, FormEvent } from 'react'
import Button from '@site/src/components/Button'
import styles from './styles.module.css'

enum Text {
  Subscribe = 'Subscribe',
  Subscribing = 'Subscribing...',
  Subscribed = 'Subscribed'
}

function LinkList() {
  const [text, setText] = useState<Text>(Text.Subscribe)
  const submit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    try {
      const email = e.target.email.value
      const form = new FormData()
      
      e.preventDefault()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return
      }
      form.append(
        'data',
        JSON.stringify({ email, table: 'handbook-newsletter' })
      )
      setText(Text.Subscribing)
      await fetch('/api/newsletter', {
        method: 'POST',
        body: form
      })
      setText(Text.Subscribed)
    } catch (error) {
      console.error(error)
      setText(Text.Subscribe)
    }
  }, [])

  return (
    <div className={styles.root}>
      <i className={styles.emailIcon} />
      <h3>Stay updated with the handbook</h3>
      <p>
        Get the latest insights and updates on LLM inference and optimization
        techniques.
      </p>
      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Enter your email address"
          name="email"
        />
        <Button
          arrow={false}
          disabled={text === Text.Subscribing}
          type="green"
          buttonType="submit"
        >
          {text}
        </Button>
      </form>
      <p className={styles.note}>
        No spam, unsubscribe at any time. We respect your privacy.
      </p>
      <ul>
        <li>Monthly insights</li>
        <li>Latest techniques</li>
        <li>Handbook updates</li>
      </ul>
    </div>
  )
}

export default LinkList
