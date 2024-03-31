"use client";
import styles from "./page.module.css";
import { ProductList } from "./components/productList";
import { SearchForm } from "./components/searchForm";
export default function Home() {
  return (
    <main>
      <SearchForm />
      <ProductList />
    </main>
  );
}
