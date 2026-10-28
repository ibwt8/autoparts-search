import OffersTable from "./OffersTable";

import styles from "./PartsSearch.module.scss";

export default function OfferGroup({ title, offers, emptyMessage }) {
  return (
    <section
      className={`${styles.card} ${styles.offerGroup}`}
      aria-label={title}
    >
      <div className={styles.groupHeading}>
        <h3>{title}</h3>
        <span
          className={styles.countLabel}
          aria-label={`Позиций: ${offers.length}`}
        >
          {offers.length}
        </span>
      </div>
      {offers.length > 0 ? (
        <OffersTable offers={offers} title={title} />
      ) : (
        <p className={styles.groupEmpty}>{emptyMessage}</p>
      )}
    </section>
  );
}
