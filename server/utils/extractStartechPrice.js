const extractStartechPrice = (priceText = "") => {
  if (!priceText) {
    return 0;
  }

  // Example:
  // "40,800৳ 42,800৳"
  // "38,850৳"
  // We want the first/main price only
  const match = priceText.match(/([\d,]+)/);

  if (!match) {
    return 0;
  }

  const numericPrice = Number(match[1].replace(/,/g, ""));

  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

module.exports = extractStartechPrice;