import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext(null);
const CART_KEY = "cart";
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

// Mock discount data for demo purposes
const DISCOUNTS = {
  SAVE10: 0.1, // 10% off
  SAVE20: 0.2, // 20% off
};

export default function CartProvider({ children }) {
  const initCart = getCartFromLocalStorage();
  const [cartItems, setCartItems] = useState(initCart.items);
  const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const totalPrice = sum(cartItems.map((item) => item.price));
    const totalCount = sum(cartItems.map((item) => item.quantity));
    const discountedPrice = totalPrice * (1 - couponDiscount); // Apply discount if any

    setTotalPrice(discountedPrice);
    setTotalCount(totalCount);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice: discountedPrice,
        totalCount,
        couponDiscount,
      })
    );
  }, [cartItems, couponDiscount]);

  function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  }

  const sum = (items) => {
    return items.reduce((prevValue, curValue) => prevValue + curValue, 0);
  };

  const removeFromCart = (foodId) => {
    const filteredCartItems = cartItems.filter(
      (item) => item.food.id !== foodId
    );
    setCartItems(filteredCartItems);
  };

  const changeQuantity = (cartItem, newQuantity) => {
    const { food } = cartItem;

    if (newQuantity < 1 || newQuantity > food.stock) {
      toast.warning(`Sorry we are under ${food.stock} in stock`);
      return;
    }

    const changedCartItem = {
      ...cartItem,
      quantity: newQuantity,
      price: food.price * newQuantity,
    };

    setCartItems(
      cartItems.map((item) =>
        item.food.id === food.id ? changedCartItem : item
      )
    );
  };

  const clearCart = () => {
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
    setCouponDiscount(0); // Clear coupon discount
  };

  const addToCart = (food) => {
    clearCart();
    const cartItem = cartItems.find((item) => item.food.id === food.id);
    if (cartItem) {
      changeQuantity(cartItem, cartItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { food, quantity: 1, price: food.price }]);
    }
  };

  const applyCoupon = (couponCode) => {
    const discount = DISCOUNTS[couponCode.toUpperCase()];
    if (discount) {
      setCouponDiscount(discount);
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
        applyCoupon, // Expose the applyCoupon function
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
