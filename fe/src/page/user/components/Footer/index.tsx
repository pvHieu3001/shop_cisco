import styles from './styles.module.css'

const Footer = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Footer thông tin */}
        <div className={styles.copyrightBar}>
          Copyright © 2025. Created by &nbsp;
          <a
            href='https://chiasekhoahoc.com'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.copyrightLink}
          >
            chiasekhoahoc.com
          </a>
          .
        </div>
      </div>
    </div>
  )
}

export default Footer
