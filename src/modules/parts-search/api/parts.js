const DEFAULT_URL = "https://api.favorit-parts.ru/hs/hsprice/";

function apiErrorMessage(error) {
  const text = typeof error === "string" ? error : JSON.stringify(error);
  const messages = [];
  if (text.includes("Empty key!")) messages.push("Не указан ключ покупателя.");
  if (text.includes("Invalid key client!"))
    messages.push("Сервис отклонил ключ покупателя.");
  if (text.includes("Empty number goods!"))
    messages.push("Укажите артикул детали.");
  if (text.includes("Request quota exceeded!"))
    messages.push("Превышен лимит запросов. Попробуйте позже.");
  // Arbitrary upstream text may include a request URL or key.
  return (
    messages.join(" ") ||
    "Сервис поиска вернул ошибку. Попробуйте повторить запрос."
  );
}

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function validateGoods(goods) {
  if (!Array.isArray(goods))
    throw new Error("Сервис вернул неожиданный формат данных.");
  return goods.filter((item) => {
    if (!isRecord(item))
      throw new Error("Сервис вернул неожиданный формат товара.");
    for (const field of ["brand", "number", "name", "goodsID"]) {
      if (item[field] !== undefined && typeof item[field] !== "string") {
        throw new Error("Сервис вернул неожиданный формат товара.");
      }
    }
    if (item.warehouses !== undefined) {
      if (
        !Array.isArray(item.warehouses) ||
        item.warehouses.some(
          (warehouse) =>
            !isRecord(warehouse) ||
            ["code", "id"].some(
              (field) =>
                warehouse[field] !== undefined &&
                typeof warehouse[field] !== "string",
            ),
        )
      ) {
        throw new Error("Сервис вернул неожиданный формат складов.");
      }
    }
    if (item.analogues !== undefined) validateGoods(item.analogues);
    return ["brand", "number", "name", "goodsID"].some((field) =>
      item[field]?.trim(),
    );
  });
}

export async function searchParts({ number, brand, signal }) {
  const article = number.trim();
  if (!article) throw new Error("Укажите артикул детали.");
  const key = import.meta.env.VITE_FAVORIT_API_KEY?.trim();
  if (!key) throw new Error("Не указан ключ покупателя.");
  let url;
  try {
    url = new URL(import.meta.env.VITE_FAVORIT_API_URL || DEFAULT_URL);
    if (!["https:", "http:"].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error("Некорректный адрес API в настройках приложения.");
  }
  url.search = new URLSearchParams({
    key,
    number: article,
    ...(brand ? { brand, analogues: "on" } : {}),
  }).toString();

  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) {
    signal.removeEventListener("abort", abort);
    throw new DOMException("Aborted", "AbortError");
  }
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      credentials: "omit",
    });
    if (!response.ok)
      throw new Error(
        `Сервис недоступен (HTTP ${response.status}). Попробуйте позже.`,
      );
    let body;
    try {
      body = await response.json();
    } catch {
      if (controller.signal.aborted)
        throw new DOMException("Aborted", "AbortError");
      throw new Error("Сервис вернул некорректный JSON.");
    }
    if (isRecord(body) && Object.hasOwn(body, "error"))
      throw new Error(apiErrorMessage(body.error));
    if (!isRecord(body))
      throw new Error("Сервис вернул неожиданный формат данных.");
    return validateGoods(body.goods);
  } catch (error) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    if (timedOut) throw new Error("Время ожидания истекло. Повторите запрос.");
    if (error instanceof TypeError) {
      throw new Error(
        "Не удалось установить соединение с сервисом. Проверьте сеть; также возможна блокировка браузером (CORS).",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
