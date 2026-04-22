const countryConfig = require("../config/countryConfig");

const generateRandomRating = () => {
  return Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
};

const generateRandomReviews = () => {
  return Math.floor(Math.random() * 900) + 50;
};

const generateRandomPrice = (country) => {
  if (country === "BD") return Math.floor(Math.random() * 9000) + 1000;
  if (country === "IN") return Math.floor(Math.random() * 15000) + 1500;
  if (country === "CN") return Math.floor(Math.random() * 3000) + 300;
  return 1000;
};

const generateMockProducts = ({ keyword, country, searchJobId }) => {
  const config = countryConfig[country];

  const productNames = [
    `${keyword} Pro`,
    `${keyword} Max`,
    `${keyword} Lite`,
    `Premium ${keyword}`,
    `Smart ${keyword}`,
    `Wireless ${keyword}`,
    `${keyword} Plus`,
    `Advanced ${keyword}`,
    `Portable ${keyword}`,
    `Budget ${keyword}`,
    `Elite ${keyword}`,
    `Ultra ${keyword}`,
  ];

  return productNames.map((name, index) => {
    const priceValue = generateRandomPrice(country);
    const rating = generateRandomRating();
    const reviewCount = generateRandomReviews();

    return {
      title: name,
      priceText: `${config.currencySymbol}${priceValue}`,
      priceValue,
      currency: config.currency,
      rating,
      reviewCount,
      image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
        name
      )}`,
      sourceSite: config.sources[index % config.sources.length],
      country,
      productUrl: `https://example.com/${country.toLowerCase()}/${encodeURIComponent(
        keyword.toLowerCase().replace(/\s+/g, "-")
      )}/${index + 1}`,
      keyword,
      score: 0,
      searchJobId,
    };
  });
};

module.exports = generateMockProducts;