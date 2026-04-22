const collectINProducts = async (keyword) => {
  return [
    {
      title: `${keyword} IN One`,
      priceText: "INR 1999",
      priceValue: 1999,
      rating: 4.5,
      reviewCount: 420,
      image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
        keyword
      )}+IN+1`,
      productUrl: `https://example.com/in/${encodeURIComponent(
        keyword.toLowerCase().replace(/\s+/g, "-")
      )}/1`,
      sourceSite: "Flipkart",
    },
    {
      title: `${keyword} IN Two`,
      priceText: "INR 2999",
      priceValue: 2999,
      rating: 4.3,
      reviewCount: 310,
      image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
        keyword
      )}+IN+2`,
      productUrl: `https://example.com/in/${encodeURIComponent(
        keyword.toLowerCase().replace(/\s+/g, "-")
      )}/2`,
      sourceSite: "Amazon India",
    },
  ];
};

module.exports = collectINProducts;