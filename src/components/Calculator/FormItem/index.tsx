import { PropsWithChildren } from 'react'
import Tooltip from 'rc-tooltip'
import styles from './styles.module.css'
import 'rc-tooltip/assets/bootstrap_white.css'

interface IFormItemProps {
  title: string
  description?: string
  note?: string
}

function FormItem({
  title,
  description,
  note,
  children
}: PropsWithChildren<IFormItemProps>) {
  return (
    <div className={styles.formItem}>
      <div className={styles.formItemTitle}>
        <span className={styles.formItemTitleText}>{title}</span>
        <div className={styles.formItemDescription}>
          <Tooltip overlay={description} placement="top" showArrow={false}>
            <span className={styles.formItemDescriptionIcon} />
          </Tooltip>
        </div>
      </div>
      <div>{children}</div>
      {note && <div>{note}</div>}
    </div>
  )
}

export default FormItem
