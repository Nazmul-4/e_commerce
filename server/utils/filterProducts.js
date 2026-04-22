const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const removeNoiseWords = (title = "") => {
  const noiseWords = [
    "intel",
    "amd",
    "nvidia",
    "official",
    "original",
    "brand",
    "new",
    "gaming",
    "laptop",
    "desktop",
  ];

  const words = normalizeText(title).split(" ");
  return words.filter((word) => !noiseWords.includes(word)).join(" ");
};

const filterProducts = (products = []) => {
  const seen = new Set();

  return products.filter((product) => {
    const title = product.title?.trim();
    const productUrl = product.productUrl?.trim();
    const priceValue = Number(product.priceValue) || 0;

    if (!title) return false;
    if (!productUrl) return false;
    if (priceValue <= 0) return false;

    if (
      productUrl.startsWith("javascript:") ||
      productUrl.startsWith("#")
    ) {
      return false;
    }

    const simplifiedTitle = removeNoiseWords(title);
    const roundedPriceBucket = Math.round(priceValue / 1000);
    const uniqueKey = `${simplifiedTitle}__${roundedPriceBucket}`;

    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });
};

module.exports = filterProducts;