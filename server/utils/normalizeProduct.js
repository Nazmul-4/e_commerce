const countryConfig = require("../config/countryConfig");

const normalizeProduct = ({
  title,
  priceText,
  priceValue,
  rating,
  reviewCount,
  image,
  sourceSite,
  country,
  productUrl,
  keyword,
  searchJobId,
}) => {
  const config = countryConfig[country];
  const safePriceValue = Number(priceValue) || 0;

  return {
    title: title?.trim() || "Unknown Product",
    priceText: `${config?.currency || "N/A"} ${safePriceValue}`,
    priceValue: safePriceValue,
    currency: config?.currency || "N/A",
    rating: Number(rating) || 0,
    reviewCount: Number(reviewCount) || 0,
    image:
      image && image.trim()
        ? image
        : "https://picsum.photos/seed/default-product/300/200",
    sourceSite: sourceSite || "Unknown Source",
    country,
    productUrl: productUrl || "",
    keyword,
    score: 0,
    searchJobId,
  };
};

module.exports = normalizeProduct;