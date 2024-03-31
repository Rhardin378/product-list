import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import styles from "../page.module.css";
import { fetchProducts } from "../store/slices/product";
import axios from "axios";
export const SearchForm = () => {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      let response = await axios.get(
        "http://localhost:8001/products/categories"
      );
      setOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategory = (e) => {
    let newCategory = e.target.value;
    setCategory(newCategory);
    dispatch(fetchProducts({ pageNum: 1, category: newCategory }));
  };

  const handlePrice = (e) => {
    let newPrice = e.target.value;
    setPrice(newPrice);
    dispatch(
      fetchProducts({ pageNum: 1, category: category, price: newPrice })
    );
  };
  const handleQuery = (e) => {
    let newQuery = e.target.value;
    setQuery(newQuery);
    dispatch(
      fetchProducts({
        pageNum: 1,
        category: category,
        price: price,
        query: newQuery,
      })
    );
  };
  return (
    <section>
      <form className={styles.searchForm}>
        {/* select onChange will set and run the fetchProducts func */}
        <input
          className={styles.searchBar}
          type="text"
          onChange={handleQuery}
        />
        <select className={styles.sortFilter} onChange={handleCategory}>
          <option value="#">Sort by Category</option>
          {options.map((option, i) => {
            return (
              <option key={i} value={option}>
                {option}
              </option>
            );
          })}
        </select>
        <select className={styles.priceFilter} onChange={handlePrice}>
          <option value="#">Sort by Price</option>
          <option value="highest">High to Low</option>
          <option value="lowest">Low to High</option>
        </select>
      </form>
    </section>
  );
};
