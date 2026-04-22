const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://www.ucc.com.bd";

const normalizeText = (text = "") =>
  text.replace(/\s+/g, " ").trim();

const extractPrice = (priceText = "") => {
  const match = priceText.match(/([\d,]+)/);
  if (!match) return 0;

  const value = Number(match[1].replace(/,/g, ""));
  return Number.isNaN(value) ? 0 : value;
};

const makeAbsoluteUrl = (url = "") => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return BASE_URL + "/" + url.replace(/^\/+/, "");
};

async function scrapeUcc(keyword) {
  try {
    // First try search
    const searchUrl = `${BASE_URL}/index.php?route=product/search&search=${encodeURIComponent(
      keyword
    )}`;

    console.log("🔍 Fetching from UCC search:", searchUrl);

    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 15000,
    });

    let $ = cheerio.load(data);
    let products = [];
    let seen = new Set();

    const collectFromPage = ($page, sourceLabel) => {
      const localProducts = [];

      $page(".product-layout, .product-grid, .product-thumb, .product-list, .product-item").each(
        (_, element) => {
          const title =
            normalizeText($page(element).find(".caption h4 a").text()) ||
            normalizeText($page(element).find("h4 a").text()) ||
            normalizeText($page(element).find(".name a").text()) ||
            normalizeText($page(element).find("a[title]").attr("title") || "");

          let productUrl =
            $page(element).find(".caption h4 a").attr("href") ||
            $page(element).find("h4 a").attr("href") ||
            $page(element).find(".name a").attr("href") ||
            "";

          let image =
            $page(element).find(".image img").attr("src") ||
            $page(element).find(".image img").attr("data-src") ||
            $page(element).find("img").attr("src") ||
            "";

          const priceText =
            normalizeText($page(element).find(".price").text()) ||
            normalizeText($page(element).find("[class*=price]").text());

          productUrl = makeAbsoluteUrl(productUrl);
          image = makeAbsoluteUrl(image);

          const priceValue = extractPrice(priceText);

          if (title && productUrl && priceValue > 0) {
            const uniqueKey = `${title.toLowerCase()}__${productUrl.toLowerCase()}`;

            if (!seen.has(uniqueKey)) {
              seen.add(uniqueKey);

              localProducts.push({
                title,
                priceText,
                priceValue,
                image,
                productUrl,
                sourceSite: sourceLabel,
                country: "BD",
                keyword,
              });
            }
          }
        }
      );

      return localProducts;
    };

    products = collectFromPage($, "UCC");

    // Fallback: if search page is weak, use laptop category page for laptop-like searches
    if (
      products.length === 0 &&
      ["laptop", "gaming laptop", "business laptop"].includes(keyword.toLowerCase().trim())
    ) {
      const fallbackUrl = `${BASE_URL}/laptops`;
      console.log("↩️ Search returned 0, trying fallback category:", fallbackUrl);

      const fallbackRes = await axios.get(fallbackUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        timeout: 15000,
      });

      $ = cheerio.load(fallbackRes.data);
      products = collectFromPage($, "UCC");
    }

    // Second fallback: all products catalog
    if (products.length === 0) {
      const catalogUrl = `${BASE_URL}/index.php?route=product/catalog`;
      console.log("↩️ Trying all products catalog fallback:", catalogUrl);

      const catalogRes = await axios.get(catalogUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        timeout: 15000,
      });

      $ = cheerio.load(catalogRes.data);
      products = collectFromPage($, "UCC").filter((product) =>
        product.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    return products;
  } catch (error) {
    console.error("❌ UCC scraper failed:", error.message);
    return [];
  }
}

(async () => {
  try {
    console.log("🚀 Starting UCC scraper test...\n");

    const keyword = "laptop";
    const results = await scrapeUcc(keyword);

    console.log(`✅ UCC results found: ${results.length}\n`);

    results.slice(0, 10).forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Price Text: ${product.priceText}`);
      console.log(`   Price Value: ${product.priceValue}`);
      console.log(`   Product URL: ${product.productUrl}`);
      console.log(`   Image URL: ${product.image}`);
      console.log(`   Source: ${product.sourceSite}`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Test runner failed:", error.message);
  }
})();