import { useDispatch, useSelector } from "react-redux";
import product from "../store/slices/product";
import { fetchProducts } from "../store/slices/product";
import { useEffect } from "react";
import { ProductListItem } from "./productListItem";
import styles from "../page.module.css";
import React from "react";
export const ProductList = () => {
  //useEffect on page load make an api call that sets the products from our GET /products route

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);
  const products = useSelector((state) => state.products.productsToShow);
  const count = useSelector((state) => state.products.count);
  // our current query to the db is passed from the backend this allows us to make sure our pagination api calls remains consistent
  const productQuery = useSelector((state) => state.products.productQuery);
  //pagination buttons are used to pass an api call to that particular page of product results
  // in other words when a page number is clicked it will make an api call to show that particular page of results
  let paginationButtons = () => {
    let buttons = [];
    for (let i = 0; i < count; i++) {
      if (i % 9 == 0) {
        if (i == 0) {
          buttons.push(
            <button
              className={styles.button}
              onClick={() =>
                dispatch(
                  fetchProducts({ pageNum: 1, category: productQuery.category })
                )
              }
            >
              {1}
            </button>
          );
        } else {
          buttons.push(
            <button
              className={styles.button}
              onClick={() =>
                dispatch(
                  fetchProducts({
                    pageNum: i / 9 + 1,
                    category: productQuery.category,
                  })
                )
              }
            >
              {i / 9 + 1}
            </button>
          );
        }
      }
    }
    return buttons;
  };
  if (products.length < 1) {
    return (
      <>
        <h1 className={styles.noProducts}>No Products Found</h1>
      </>
    );
  }
  return (
    <>
      <section className={styles.section}>
        {products.map((product) => {
          return <ProductListItem key={product._id} product={product} />;
        })}
      </section>
      <div className={styles.buttons}>{paginationButtons()}</div>
    </>
  );
};
