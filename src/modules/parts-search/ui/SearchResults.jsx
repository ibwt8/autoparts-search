import { ErrorNotice, Loader, PartIcon } from "../../../shared/ui";

import OfferGroup from "./OfferGroup";

import styles from "./PartsSearch.module.scss";

export default function SearchResults({ search }) {
  const {
    article,
    selectedBrand,
    offers,
    offersStatus,
    offersError,
    hasArticle,
    selectedOffers,
    analogueOffers,
    retryOffers,
  } = search;
  return (
    <section
      className={styles.resultsSection}
      aria-labelledby="results-title"
      aria-busy={offersStatus === "loading"}
    >
      <div className={styles.resultsHeading}>
        <div>
          <h2 id="results-title">
            Предложения и аналоги
            {offersStatus === "succeeded" && (
              <span className={styles.countLabel}>{offers.length}</span>
            )}
          </h2>
          <p>
            {selectedBrand
              ? `${selectedBrand} · ${article.trim()}`
              : "Цены и остатки по каждому складу"}
          </p>
        </div>
        <span className={styles.resultsNote}>
          <span aria-hidden="true">≡</span> Предложения по складам
        </span>
      </div>
      {offersStatus === "succeeded" ? (
        <div className={styles.resultGroups}>
          <OfferGroup
            title="Выбранная деталь"
            offers={selectedOffers}
            emptyMessage="Предложения выбранной детали не найдены."
          />
          <OfferGroup
            title="Аналоги других производителей"
            offers={analogueOffers}
            emptyMessage="Аналоги не найдены."
          />
        </div>
      ) : (
        <div className={`${styles.card} ${styles.resultsCard}`}>
          {offersStatus === "loading" && (
            <div className={styles.resultsFeedback}>
              <Loader>Ищем предложения и аналоги…</Loader>
            </div>
          )}
          {offersStatus === "failed" && (
            <div className={styles.resultsFeedback}>
              <ErrorNotice message={offersError} onRetry={retryOffers} />
            </div>
          )}
          {offersStatus === "idle" && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <PartIcon />
              </div>
              <h3>
                {hasArticle
                  ? "Осталось выбрать производителя"
                  : "Начните с артикула"}
              </h3>
              <p>
                {hasArticle
                  ? "После выбора бренда здесь появятся предложения и аналоги."
                  : "Найдём производителей, доступные запчасти и их аналоги."}
              </p>
              <div className={styles.flowHint} aria-hidden="true">
                <span>Артикул</span>
                <b>→</b>
                <span>Бренд</span>
                <b>→</b>
                <span>Предложения</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
