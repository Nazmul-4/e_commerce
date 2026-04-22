const calculateScore = (product) => {
  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;
  const priceValue = Number(product.priceValue) || 0;
  const title = (product.title || "").toLowerCase();
  const keyword = (product.keyword || "").toLowerCase();
  const sourceSite = (product.sourceSite || "").toLowerCase();

  let score = 0;

  // Main quality score
  score += rating * 18;
  score += reviewCount * 1.2;

  // Price contribution
  if (priceValue > 0) {
    score += Math.min(priceValue / 3000, 18);
  }

  // Strong exact keyword match
  if (keyword && title.includes(keyword)) {
    score += 25;
  }

  // Word-by-word keyword bonus
  const keywordTerms = keyword
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  keywordTerms.forEach((term) => {
    if (term && title.includes(term)) {
      score += 8;
    }
  });

  // Source weighting
  if (sourceSite.includes("star tech")) {
    score += 8;
  }

  if (sourceSite.includes("ucc")) {
    score += 6;
  }

  // Quality penalties
  if (rating <= 0) score -= 8;
  if (reviewCount <= 0) score -= 8;
  if (priceValue <= 0) score -= 10;

  if (score < 0) {
    score = 0;
  }

  return Number(score.toFixed(2));
};

module.exports = calculateScore;