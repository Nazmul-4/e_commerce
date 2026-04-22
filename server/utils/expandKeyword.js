const keywordMap = {
  shoe: ["shoe", "shoes", "sneaker", "footwear", "boot"],
  earphone: ["earphone", "earphones", "headphone", "headphones", "audio"],
  watch: ["watch", "wrist watch", "accessory"],
  shirt: ["shirt", "tshirt", "t-shirt", "top", "clothing"],
  jacket: ["jacket", "coat", "outerwear"],
  bag: ["bag", "backpack", "handbag", "purse"],
  ring: ["ring", "jewelry", "accessory"],
  mouse: ["mouse", "computer mouse", "electronics"],
};

const expandKeyword = (keyword = "") => {
  const cleaned = keyword.toLowerCase().trim();

  if (!cleaned) return [];

  const direct = keywordMap[cleaned] || [];
  const splitWords = cleaned.split(/\s+/);

  const expandedFromWords = splitWords.flatMap((word) => keywordMap[word] || [word]);

  const combined = [cleaned, ...direct, ...expandedFromWords];

  return [...new Set(combined)];
};

module.exports = expandKeyword;