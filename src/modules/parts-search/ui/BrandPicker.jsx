import styles from "./BrandPicker.module.scss";

export default function BrandPicker({ brands, selectedBrand, onSelect }) {
  return (
    <div className={styles.list} role="group" aria-label="Выбор производителя">
      {brands.map((brand) => (
        <button
          type="button"
          key={brand}
          className={`${styles.button} ${brand === selectedBrand ? styles.selected : ""}`}
          aria-pressed={brand === selectedBrand}
          onClick={() => onSelect(brand)}
        >
          {brand}
          <span aria-hidden="true">{brand === selectedBrand ? "✓" : "→"}</span>
        </button>
      ))}
    </div>
  );
}
