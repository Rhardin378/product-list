import { useDispatch, useSelector } from "react-redux";
import product from "../store/slices/product";
import { fetchProducts } from "../store/slices/product";
import { useEffect } from "react";
import { ProductListItem } from "./productListItem";
import styles from "../page.module.css";
import React from "react";
export const ProductList = () => {
  //useEffect on page load make an api call that sets the items from GET Products

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);
  const products = useSelector((state) => state.products.productsToShow);
  const count = useSelector((state) => state.products.count);
  const productQuery = useSelector((state) => state.products.productQuery);
  console.log(products);
  console.log(count);
  console.log(productQuery);
  // use asyncThunk from redux store that is a get request

  let paginationButtons = (query) => {
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
