const simplifyText = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const filterProducts = (products = []) => {
  const seen = new Set();

  return products.filter((product) => {
    const title = product.title?.trim();
    const productUrl = product.productUrl?.trim();
    const priceValue = Number(product.priceValue) || 0;

    if (!title) return false;
    if (!productUrl) return false;

    if (
      productUrl.startsWith("javascript:") ||
      productUrl.startsWith("#")
    ) {
      return false;
    }

    if (priceValue <= 0) return false;

    const simplifiedTitle = simplifyText(title);
    const simplifiedUrl = productUrl.toLowerCase().trim();

    // smarter duplicate key
    const uniqueKey = `${simplifiedTitle}__${simplifiedUrl}`;

    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });
};

module.exports = filterProducts;