const numeric = (value) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

export function getBrands(goods) {
  return [
    ...new Set(
      goods
        .map((item) => item.brand)
        .filter((brand) => typeof brand === "string" && brand.trim()),
    ),
  ];
}

export function getOffers(goods) {
  const rows = [];
  function addProduct(product, path, isAnalogue) {
    if (
      !["goodsID", "brand", "number", "name"].some((field) =>
        product[field]?.trim(),
      )
    )
      return;
    const base = {
      name: product.name || "Без названия",
      brand: product.brand || "—",
      number: product.number || "—",
      isAnalogue,
    };
    if (!product.warehouses?.length) {
      rows.push({
        ...base,
        id: path,
        warehouse: "—",
        price: null,
        stock: null,
        totalStock: numeric(product.count),
        noOffers: true,
      });
      return;
    }
    product.warehouses.forEach((warehouse, index) => {
      rows.push({
        ...base,
        id: `${path}/${index}`,
        warehouse: warehouse.code || warehouse.id || "Не указан",
        price: numeric(warehouse.price),
        stock: numeric(warehouse.stock),
        noOffers: false,
      });
    });
  }
  goods.forEach((product, index) => {
    addProduct(product, `goods/${index}`, false);
    product.analogues?.forEach((analogue, analogueIndex) => {
      addProduct(analogue, `goods/${index}/analogues/${analogueIndex}`, true);
    });
  });
  return rows;
}
