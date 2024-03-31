const router = require("express").Router();
const faker = require("faker");
const Product = require("../models/product");
const Review = require("../models/review");

//an api call to generate fake data to populate our store
router.get("/generate-fake-data", (req, res, next) => {
  for (let i = 0; i < 90; i++) {
    let product = new Product();

    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.image = "https://via.placeholder.com/250?text=Product+Image";

    product
      .save()
      .then(() => console.log("product saved"))
      .catch((err) => console.log(err));
  }
  res.end();
});
// this route sends back a list of all distinct categories (unique categories)

router.get("/products/categories", (req, res, next) => {
  Product.distinct("category").then((categories) => {
    res.send(categories);
  });
});

/*
 * GET route to fetch products based on query parameters.
 * Supports pagination, category filtering, price sorting, and partial search.
 * Query Parameters:
 *   - page: Pagination page number (default: 1)
 *   - category: Filter products by category
 *   - price: Sort products by price ("highest" or "lowest")
 *   - query: Search query for partial matching on product names
 * Returns an array of products, total count of products, and query parameters used.
 */

router.get("/products", (req, res, next) => {
  const productsPerPage = 9;
  let querySearch;
  let { page = 1, category, price, query } = req.query;
  let responseQuery = { page, category, price, query };
  if (!query) {
    querySearch = {};
  } else {
    //regex to allow to for a partial search instead of exact search
    let regexPattern = new RegExp(query, "i");
    querySearch = { name: { $regex: regexPattern } };
  }
  if (!category) {
    Product.find(querySearch)
      .skip(productsPerPage * page - productsPerPage)
      .limit(productsPerPage)
      .then((products) => {
        return Product.countDocuments(querySearch).then((count) => ({
          products,
          count,
          responseQuery,
        }));
      })
      .then(({ products, count, responseQuery }) => {
        if (price) {
          if (price === "highest") {
            products = products.sort((a, b) => b.price - a.price);
          } else {
            products = products.sort((a, b) => a.price - b.price);
          }
          res.send({ products, count, responseQuery });
        } else {
          res.send({ products, count, responseQuery });
        }
      })
      .catch((err) => {
        // Handle errors
        console.log(err);
        res.end();
      });
  } else {
    Product.find({ category: category, ...querySearch })
      .skip(productsPerPage * page - productsPerPage)
      .limit(productsPerPage)
      .then((products) => {
        return Product.countDocuments({
          category: category,
          ...querySearch,
        }).then((count) => ({
          products,
          count,
          responseQuery,
        }));
      })
      .then(({ products, count, responseQuery }) => {
        if (price) {
          if (price === "highest") {
            products = products.sort((a, b) => b.price - a.price);
          } else {
            products = products.sort((a, b) => a.price - b.price);
          }
          res.send({ products, count, responseQuery });
        } else {
          res.send({ products, count, responseQuery });
        }
      })
      .catch((err) => {
        // Handle errors
        console.log(err);
        res.end();
      });
  }
});

// get a single product by id

router.get("/products/:product/", (req, res, next) => {
  const productId = req.params.product;
  Product.findById(productId)
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(404);
      res.json("product not found");
    });
});

//get a single product's reviews
router.get("/products/:product/reviews", (req, res, next) => {
  // if there is a page query it will take the page number and return 4 items associated with that page starting at the first index
  let reviewsPerPage = 4;
  let startIndex = reviewsPerPage * req.query.page - reviewsPerPage || 0;
  // page number / 4 greater than length err
  let product = Product.findById(req.params.product).populate({
    path: "reviews",
    options: {
      skip: startIndex,
      limit: reviewsPerPage,
    },
  });
  product.then((product) => {
    if (product.reviews < 1) {
      res.status(404).send("no reviews left");
    } else {
      res.status(200).json(product.reviews);
    }
  });
});

// add a product route

router.post("/products", (req, res, next) => {
  const product = Product({
    category: req.body.category,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
  });

  product
    .save()
    .then(() => {
      res.status(200).end();
    })
    .catch((err) => console.log(err));
});
// route to add a review to particular product
router.post("/products/:product/reviews", (req, res, next) => {
  // find the product
  //access reviews of product
  //save review and product

  const foundProduct = Product.findById(req.params.product);
  foundProduct
    .then((product) => {
      let review = Review({
        userName: req.body.userName,
        text: req.body.text,
        product: req.body.product,
      });
      review.save();
      product.reviews.push(review);

      product.save();
      res.status(200);
      console.log("review saved");
      res.end();
    })
    .catch((err) => {
      err.message = "Product not found";
      console.log(err.message);
      res.status(404).end();
    });
});

//route to delete a product

router.delete("/products/:product", (req, res, next) => {
  const foundProduct = Product.findByIdAndDelete(req.params.product);

  foundProduct
    .then((product) => {
      if (!product) {
        res.status(404);
      } else {
        console.log("product deleted");
        res.status(204).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

// route to delete a review from a product

router.delete("/products/:product/:review", (req, res, next) => {
  //find review that has product field
  const foundReview = Review.findOneAndDelete({
    product: req.params.product,
    _id: req.params.review,
  });
  foundReview
    .then((review) => {
      console.log("deleted");
      res.status(200);
      res.end();
    })
    .catch((err) => console.log(err));
});
module.exports = router;
