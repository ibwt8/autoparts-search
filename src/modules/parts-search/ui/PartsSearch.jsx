import { PartIcon } from "../../../shared/ui";

import { usePartsSearch } from "../hooks/usePartsSearch";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

import styles from "./PartsSearch.module.scss";

export default function PartsSearch() {
  const search = usePartsSearch();
  return (
    <>
      <section className={styles.pageHeading} aria-labelledby="page-title">
        <div>
          <div className={styles.eyebrow}>
            <span />
            ПОИСК ПО АРТИКУЛУ
          </div>
          <h1 id="page-title">
            Нужная деталь.
            <br className={styles.mobileBreak} /> Все предложения.
          </h1>
          <p>
            Введите артикул и выберите производителя, чтобы сравнить запчасти и
            аналоги.
          </p>
        </div>
        <div className={styles.headingMark} aria-hidden="true">
          <PartIcon />
        </div>
      </section>
      <SearchForm search={search} />
      <SearchResults search={search} />
    </>
  );
}
