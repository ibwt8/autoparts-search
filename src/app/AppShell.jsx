import { PartIcon } from "../shared/ui";

import styles from "./AppShell.module.scss";

export default function AppShell({ children }) {
  return (
    <div className={styles.appShell}>
      <header className={styles.topbar}>
        <div className={`${styles.appContainer} ${styles.topbarInner}`}>
          <a
            className={styles.wordmark}
            href="./"
            aria-label="Автоподбор — главная"
          >
            <PartIcon />
            автоподбор<span className={styles.wordmarkDot}>.</span>
          </a>
          <span className={styles.topbarDescription}>
            Поиск запчастей и аналогов
          </span>
        </div>
      </header>
      <main className={`${styles.appContainer} ${styles.main}`}>
        {children}
      </main>
      <footer className={`${styles.appContainer} ${styles.pageFooter}`}>
        <span>Данные предоставлены Favorit Parts</span>
        <span>Цены и остатки актуальны на момент запроса</span>
      </footer>
    </div>
  );
}
