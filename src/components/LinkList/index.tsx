import { PropsWithChildren } from 'react'
import styles from './styles.module.css'

function LinkList({ children }: PropsWithChildren) {
  return <div className={styles.section}>{children}</div>
}

export default LinkList
