import React, { useState } from "react";
import { Link } from "react-router-dom";
import Price from "../../components/Price/Price";
import Title from "../../components/Title/Title";
import { useCart } from "../../hooks/useCart";
import classes from "./cartPage.module.css";
import NotFound from "../../components/NotFound/NotFound";
export default function CartPage() {
  const { cart, removeFromCart, changeQuantity, clearCart, applyCoupon } =
    useCart();

  const [couponCode, setCouponCode] = useState("");
  const [manageCouponSection, setManageCouponSection] = useState(false);

  const manageCoupon = (event) => {
    setManageCouponSection(!event);
    clearCart();
  };

  const handleCouponChange = (event) => {
    setCouponCode(event.target.value);
  };

  const handleApplyCoupon = () => {
    applyCoupon(couponCode);
  };

  return (
    <>
      <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />

      {cart.items.length === 0 ? (
        <NotFound message="Cart Page Is Empty!" />
      ) : (
        <div className={classes.container}>
          <ul className={classes.list}>
            {cart.items.map((item) => (
              <li key={item.food.id}>
                <div>
                  <img src={`${item.food.imageUrl}`} alt={item.food.name} />
                </div>
                <div>
                  <Link to={`/food/food/${item.food.id}`}>
                    {item.food.name}
                  </Link>
                </div>

                <div>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      changeQuantity(item, Number(e.target.value))
                    }
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </select>
                </div>

                <div>
                  <Price price={item.price} />
                </div>

                <div>
                  <button
                    className={classes.button}
                    onClick={() => removeFromCart(item.food.id)}
                  >
                    Remove
                  </button>

                  <button
                    className={classes.button}
                    onClick={() => manageCoupon(manageCouponSection)}
                  >
                    Apply Code
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={classes.checkout}>
            <div>
              <div className={classes.foods_count}>{cart.totalCount}</div>
              {manageCouponSection && (
                <div className={classes.couponSection}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={handleCouponChange}
                    placeholder="Enter coupon code"
                    className={classes.couponInput}
                  />
                  <button
                    className={classes.couple_button}
                    onClick={handleApplyCoupon}
                  >
                    Apply Code
                  </button>
                </div>
              )}
              <div className={classes.total_price}>
                <Price price={cart.totalPrice} />
              </div>
            </div>

            <Link to="/checkout">Proceed To Checkout</Link>
          </div>
        </div>
      )}
    </>
  );
}
