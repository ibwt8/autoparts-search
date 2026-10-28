import { ErrorNotice, Loader } from "../../../shared/ui";

import BrandPicker from "./BrandPicker";

import styles from "./PartsSearch.module.scss";

export default function SearchForm({ search }) {
  const {
    article,
    brands,
    selectedBrand,
    brandsStatus,
    brandsError,
    hasArticle,
    changeArticle,
    selectBrand,
    retryBrands,
  } = search;
  return (
    <section
      className={`${styles.card} ${styles.searchCard}`}
      aria-label="Подбор запчастей"
    >
      <div>
        <div className={styles.stepHeading}>
          <span className={styles.stepNumber}>01</span>
          <h2>Найдите деталь</h2>
        </div>
        <label htmlFor="article" className={styles.formLabel}>
          Артикул / номер детали
        </label>
        <div className={styles.searchInputWrap}>
          <svg
            className={styles.searchIcon}
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="10.5"
              cy="10.5"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="m16 16 4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="article"
            className={styles.articleInput}
            placeholder="Например, 01089"
            value={article}
            onChange={(event) => changeArticle(event.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-describedby="article-help"
          />
          {article && (
            <button
              className={styles.clearInput}
              type="button"
              aria-label="Очистить артикул"
              onClick={() => changeArticle("")}
            >
              ×
            </button>
          )}
        </div>
        <p id="article-help" className={styles.fieldHelp}>
          Поиск начнётся автоматически после ввода.
        </p>
      </div>

      <div
        className={`${styles.brandStep} ${!hasArticle ? styles.stepInactive : ""}`}
      >
        <div className={styles.stepHeading}>
          <span
            className={`${styles.stepNumber} ${!hasArticle ? styles.stepNumberMuted : ""}`}
          >
            02
          </span>
          <h2>Выберите производителя</h2>
          {brandsStatus === "succeeded" && brands.length > 0 && (
            <span className={styles.countLabel}>{brands.length}</span>
          )}
        </div>
        {brandsStatus === "loading" && <Loader>Ищем производителей…</Loader>}
        {brandsStatus === "failed" && (
          <ErrorNotice message={brandsError} onRetry={retryBrands} />
        )}
        {brandsStatus === "succeeded" && brands.length === 0 && (
          <p className={styles.emptyMessage}>
            Производители не найдены. Проверьте артикул.
          </p>
        )}
        {brands.length > 0 && (
          <BrandPicker
            brands={brands}
            selectedBrand={selectedBrand}
            onSelect={selectBrand}
          />
        )}
        {brandsStatus === "idle" && (
          <p className={styles.brandHint}>
            {hasArticle
              ? "Готовим поиск по артикулу…"
              : "Сначала введите артикул — здесь появятся найденные бренды."}
          </p>
        )}
        {brands.length > 0 && !selectedBrand && (
          <p className={styles.fieldHelp}>
            Выберите бренд для поиска предложений и аналогов.
          </p>
        )}
      </div>
    </section>
  );
}
