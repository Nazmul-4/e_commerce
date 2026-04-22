const calculateScore = (product) => {
  const rating = Number(product.rating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;
  const priceValue = Number(product.priceValue) || 0;

  let score = reviewCount * 0.45 + rating * 20;

  // Small penalty if price is missing or zero
  if (priceValue <= 0) {
    score -= 20;
  }

  // Small penalty if rating is missing
  if (rating <= 0) {
    score -= 15;
  }

  // Small penalty if reviews are missing
  if (reviewCount <= 0) {
    score -= 15;
  }

  return Number(score.toFixed(2));
};

module.exports = calculateScore;