import styles from "./OffersTable.module.scss";

const priceFormat = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const countFormat = new Intl.NumberFormat("ru-RU");

export default function OffersTable({ offers, title }) {
  return (
    <div
      className={styles.scroll}
      role="region"
      aria-label={`Таблица: ${title}`}
      tabIndex={0}
    >
      <table className={styles.table} aria-label={title}>
        <thead>
          <tr>
            <th scope="col">Название / Производитель</th>
            <th scope="col" className={styles.numeric}>
              Цена
            </th>
            <th scope="col" className={styles.numeric}>
              Остаток, шт.
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id}>
              <td>
                <div className={styles.brand}>{offer.brand}</div>
                <div className={styles.name}>{offer.name}</div>
              </td>
              <td className={`${styles.numeric} ${styles.price}`}>
                {offer.price === null ? "—" : priceFormat.format(offer.price)}
              </td>
              <td className={styles.numeric}>
                {offer.noOffers ? (
                  <>
                    <span className={styles.noStock}>Нет предложений</span>
                    {offer.totalStock !== null && (
                      <small className={styles.totalStock}>
                        Общий остаток: {countFormat.format(offer.totalStock)}
                      </small>
                    )}
                  </>
                ) : offer.stock === null ? (
                  "—"
                ) : (
                  <span
                    className={`${styles.stock} ${offer.stock === 0 ? styles.zero : ""}`}
                  >
                    {countFormat.format(offer.stock)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
