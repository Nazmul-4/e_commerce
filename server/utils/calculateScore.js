const calculateScore = (product) => {
  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;
  const priceValue = Number(product.priceValue) || 0;
  const title = (product.title || "").toLowerCase();
  const keyword = (product.keyword || "").toLowerCase();
  const sourceSite = (product.sourceSite || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const availability = (product.availability || "").toLowerCase();

  let score = 0;

  score += rating * 20;
  score += Math.min(reviewCount * 1.3, 70);

  if (priceValue > 0) {
    score += Math.min(priceValue / 4000, 25);
  }

  if (keyword && title.includes(keyword)) {
    score += 30;
  }

  keyword
    .split(/\s+/)
    .filter(Boolean)
    .forEach((term) => {
      if (title.includes(term)) score += 8;
    });

  if (brand) score += 8;
  if (availability.includes("in stock") || availability.includes("available")) {
    score += 10;
  }

  if (sourceSite.includes("star tech")) score += 8;
  if (sourceSite.includes("ucc")) score += 7;

  if (rating <= 0) score -= 10;
  if (reviewCount <= 0) score -= 10;
  if (priceValue <= 0) score -= 15;

  return Number(Math.max(score, 0).toFixed(2));
};

module.exports = calculateScore;