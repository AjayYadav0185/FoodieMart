import React from "react";

export default function Price({ originalPrice, price, locale, currency }) {
  const formatPrice = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);

  return (
    <div>
      <span>{formatPrice(price)}</span>
      {originalPrice && originalPrice !== price && (
        <span style={{ textDecoration: "line-through", marginLeft: "8px" }}>
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

Price.defaultProps = {
  locale: "en-US",
  currency: "INR",
};
