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
  const safeTitle = title?.trim() || "Unknown Product";
  const safePriceValue = Number(priceValue) || 0;
  const safeRating = Number(rating) || 0;
  const safeReviewCount = Number(reviewCount) || 0;

  return {
    title: safeTitle,
    priceText: `${config?.currency || "N/A"} ${safePriceValue}`,
    priceValue: safePriceValue,
    currency: config?.currency || "N/A",
    rating: safeRating,
    reviewCount: safeReviewCount,
    image:
      image && image.trim()
        ? image
        : `https://picsum.photos/seed/${encodeURIComponent(
            safeTitle
          )}/300/200`,
    sourceSite: sourceSite || "Unknown Source",
    country,
    productUrl: productUrl || "",
    keyword,
    score: 0,
    searchJobId,
  };
};

module.exports = normalizeProduct;