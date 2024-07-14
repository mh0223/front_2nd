import { useState } from "react";
import { Product } from "../../types.ts";

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const addProduct = (addedProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, addedProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
