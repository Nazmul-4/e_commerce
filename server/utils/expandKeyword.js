const keywordMap = {
  shoe: ["shoe", "shoes", "mens-shoes", "womens-shoes", "footwear", "sneakers"],
  watch: ["watch", "watches", "mens-watches", "womens-watches", "accessories"],
  earphone: ["earphone", "earphones", "headphone", "headphones", "audio", "mobile-accessories"],
  mouse: ["mouse", "computer mouse", "electronics", "mobile-accessories"],
  ring: ["ring", "rings", "jewellery", "womens-jewellery", "accessories"],
  bag: ["bag", "bags", "womens-bags", "backpack", "handbag"],
  shirt: ["shirt", "shirts", "mens-shirts", "tops", "clothing"],
  jacket: ["jacket", "coat", "outerwear", "tops", "clothing"],
};

const expandKeyword = (keyword = "") => {
  const cleaned = keyword.toLowerCase().trim();
  if (!cleaned) return [];

  const direct = keywordMap[cleaned] || [];
  const splitWords = cleaned.split(/\s+/);
  const expandedFromWords = splitWords.flatMap((word) => keywordMap[word] || [word]);

  return [...new Set([cleaned, ...direct, ...expandedFromWords])];
};

module.exports = expandKeyword;