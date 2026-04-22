//make sure that all collected products follow the same structure

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

  return {
    title: title?.trim() || "Unknown Product",
    priceText: priceText || `${config?.currency || ""} ${priceValue || 0}`,
    priceValue: Number(priceValue) || 0,
    currency: config?.currency || "N/A",
    rating: Number(rating) || 0,
    reviewCount: Number(reviewCount) || 0,
    image: image || "https://via.placeholder.com/300x200?text=No+Image",
    sourceSite: sourceSite || "Unknown Source",
    country,
    productUrl: productUrl || "",
    keyword,
    score: 0,
    searchJobId,
  };
};

module.exports = normalizeProduct;