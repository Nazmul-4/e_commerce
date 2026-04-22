const calculateScore = (product) => {
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  const score = reviewCount * 0.45 + rating * 20;

  return Number(score.toFixed(2));
};

module.exports = calculateScore;