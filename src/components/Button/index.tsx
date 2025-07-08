import { PropsWithChildren } from 'react'
import clsx from 'clsx'
import ArrowSquare from './ArrowSquare'
import styles from './styles.module.css'

interface LinkButtonProps {
  type?:
    | 'blue'
    | 'light-blue'
    | 'green'
    | 'light-green'
    | 'pink'
    | 'light-purple'
    | 'yellow'
  className?: string
}

const colors: { [key in LinkButtonProps['type']]: string } = {
  blue: styles.buttonBlue,
  'light-blue': styles.buttonLightBlue,
  green: styles.buttonGreen,
  'light-green': styles.buttonLightGreen,
  pink: styles.buttonPink,
  'light-purple': styles.buttonLightPurple,
  yellow: styles.buttonYellow
}

function Button({
  children,
  type,
  className
}: PropsWithChildren<LinkButtonProps>) {
  return (
    <button
      type="button"
      className={clsx(styles.button, colors[type], className)}
    >
      <span className={styles.buttonInner}>
        {children}
        <ArrowSquare className={styles.buttonIcon} />
      </span>
    </button>
  )
}

export default Button
