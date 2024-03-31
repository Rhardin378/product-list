import styles from "../page.module.css";
export const ProductListItem = ({ product }) => {
  return (
    <article className={styles.productListItem}>
      <div className={styles.productInfo}>
        <div className={styles.productCategory}>
          <span>Category: </span>
          <span className={styles.categoryName}>{product.category}</span>
        </div>
        <div>
          <span className={styles.productPrice}>{product.price}</span>
        </div>
      </div>

      <img alt="placeHolder" src={product.image} />
      <h1 className={styles.productName}>{product.name}</h1>
    </article>
  );
};
