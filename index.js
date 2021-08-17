const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const sanitize = require("sanitize-filename");

const baseUrl = "https://www.rareseeds.com";
const cacheDir = path.join(process.cwd(), "tmp");

const getHtml = async (url) => {
  try {
    const cacheName = sanitize(url);
    return await (async () => {
      try {
        return await fs.promises.readFile(
          path.join(cacheDir, cacheName),
          "utf8"
        );
      } catch (e) {
        // ignore
      }

      response = await axios.get(url);
      await fs.promises.writeFile(
        path.join(cacheDir, cacheName),
        response.data,
        "utf8"
      );
      return response.data;
    })();
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get all seed categories.
 *
 * There are currently 196 categories total.
 * (So this function should return an array of 196 urls).
 */
const getCategoriesAwait = async () => {
  try {
    const url = baseUrl + "/store/vegetables";
    const html = await getHtml(url);

    const $ = cheerio.load(html);

    const categories = $("#narrow-by-list2 .item a")
      .map(function (index, element) {
        const name = $(element).text();
        const url = $(element).attr("href");
        return { name, url };
      })
      .get();

    return categories;
  } catch (e) {
    console.log(e);
  }
};

/**
 * Get all products for a given url.
 *
 * @param {*} url
 * @returns an array of product objects
 */
const getProductsAwait = async (url) => {
  try {
    const html = await getHtml(url);
    const $ = cheerio.load(html);

    const category = $("h1.page-title span").text();

    const products = $(".product-items .grid--item_product")
      .map(function (index, element) {
        // The name element contains several pieces of info we need.
        const NameData = $(".product--name a", element)
          .text()
          .split("\n")
          .map(function (item) {
            return item.trim() ? item.trim() : null;
          })
          .filter(Boolean);

        const name = NameData[0];
        const code = NameData[1];
        const price = NameData[2];
        const rating = $(".rating-result", element).attr("title");
        const reviews = parseInt($(".action", element).text().split("\n")[0].split(/\s+/)[0]);
        const productUrl = $(".product--name a", element).attr("href");

        return { name, code, price, rating, reviews, productUrl, category, 'categoryUrl': url, };
      })
      .get();

    return products;
  } catch (e) {
    console.log(e);
  }
};

const saveJson = (jsonObj, fileName) => {
  const jsonContent = JSON.stringify(jsonObj);

  fs.writeFile(fileName, jsonContent, 'utf8', function (e) {
    if (e) {
      return console.log(e);
    }
  })

  console.log('JSON file has been saved.');
};

/**
 *
 */
const main = async function () {
  const categories = await getCategoriesAwait();

  const promises = categories.map((category) => {
    return getProductsAwait(category.url);
  });

  const result = await Promise.all(promises);
  const products = Array.prototype.concat.apply([], result);

  // saveJson({ products }, 'output.json');

  const numProducts = products.length;
  const numCategories = categories.length;

  products.sort((a, b) => (a.reviews < b.reviews) ? 1 : -1);

  const filteredProducts = (products.filter(product => {
    return product.reviews >= 100 && product.rating >= "90%";
  }));
  const numFilteredProducts = filteredProducts.length;

  // console.log(`${numProducts} products found within ${numCategories} categories.`);
  // console.log(`${numFilteredProducts} products have more than 100 reviews`);
  console.log({ products: filteredProducts });
};

main();
