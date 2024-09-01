import React from "react";

const Stock = ({ stock, locale, currency, lowStockThreshold }) => {
  const isLowStock = stock <= lowStockThreshold;

  return (
    <div>
      <span>In Stock {stock}</span>
      {isLowStock && (
        <span style={{ color: "red", marginLeft: "8px" }}>(Low stock!)</span>
      )}
    </div>
  );
};

Stock.defaultProps = {
  lowStockThreshold: 10,
};

export default Stock;
