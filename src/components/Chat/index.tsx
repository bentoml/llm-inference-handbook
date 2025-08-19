import { useState, useEffect } from 'react'
import Button from '@site/src/components/Button'
import styles from './styles.module.css'

function Chat() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (window?.innerWidth > 768) {
      setIsOpen(true)
    }
  }, [])

  return (
    <>
      <div className={styles.chat} onClick={() => setIsOpen(!isOpen)}>
        <i className={styles.chatIcon} />
      </div>
      {isOpen && (
        <div className={styles.chatContent}>
          <button
            className={styles.chatClose}
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <h4>Need Help with LLM Inference?</h4>
          <p>
            Top AI teams use Bento to build fast, cost-efficient LLM serving
            solutions tailored to their workloads.
          </p>
          <div>
            <a
              href="https://l.bentoml.com/contact-us-llm-inference-handbook"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.chatLink}
            >
              <Button type="green" className={styles.chatButton}>
                Request a Demo
              </Button>
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default Chat
