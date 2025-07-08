import { PropsWithChildren } from 'react'
import styles from './styles.module.css'

function Features({ children }: PropsWithChildren) {
  return <div className={styles.features}>{children}</div>
}

export default Features
