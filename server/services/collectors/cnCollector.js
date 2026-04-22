const collectCNProducts = async (keyword) => {
  return [
    {
      title: `${keyword} CN One`,
      priceText: "CNY 299",
      priceValue: 299,
      rating: 4.1,
      reviewCount: 520,
      image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
        keyword
      )}+CN+1`,
      productUrl: `https://example.com/cn/${encodeURIComponent(
        keyword.toLowerCase().replace(/\s+/g, "-")
      )}/1`,
      sourceSite: "Alibaba",
    },
    {
      title: `${keyword} CN Two`,
      priceText: "CNY 399",
      priceValue: 399,
      rating: 4.6,
      reviewCount: 450,
      image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(
        keyword
      )}+CN+2`,
      productUrl: `https://example.com/cn/${encodeURIComponent(
        keyword.toLowerCase().replace(/\s+/g, "-")
      )}/2`,
      sourceSite: "AliExpress",
    },
  ];
};

module.exports = collectCNProducts;