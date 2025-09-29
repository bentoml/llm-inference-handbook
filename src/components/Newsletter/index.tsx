import { useState, useCallback, FormEvent } from 'react'
import Button from '@site/src/components/Button'
import styles from './styles.module.css'

enum Text {
  Subscribe = 'Subscribe',
  Subscribing = 'Subscribing...',
  Subscribed = 'Subscribed'
}

function LinkList() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
      setLoading(true)
      await fetch('/api/newsletter', {
        method: 'POST',
        body: form
      })
      setSuccess(true)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [])

  if (success) {
    return (
      <div className={styles.root}>
        <i className={styles.checkIcon} />
        <h3>Thank you for subscribing!</h3>
        <p>
          You'll receive the latest updates on LLM inference and optimization
          techniques directly in your inbox.
        </p>
      </div>
    )
  }
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
          disabled={loading}
          type="green"
          buttonType="submit"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      <ul>
        <li>Monthly insights</li>
        <li>Latest techniques</li>
        <li>Handbook updates</li>
      </ul>
    </div>
  )
}

export default LinkList
