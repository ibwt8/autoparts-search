import styles from "./Feedback.module.scss";

export function Loader({ children }) {
  return (
    <div className={styles.loading} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function ErrorNotice({ message, onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <div>
        <strong>Не удалось выполнить поиск</strong>
        <p className={styles.message}>{message}</p>
      </div>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Повторить
      </button>
    </div>
  );
}
