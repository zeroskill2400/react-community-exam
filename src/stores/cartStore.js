import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const cart = state.cart;
          const productInCart = cart.find((item) => item.id === product.id);

          if (productInCart) {
            const updatedCart = cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            console.log(
              "장바구니에 담긴 상품의 수량을 증가시켰습니다.",
              updatedCart
            );
            return { cart: updatedCart };
          } else {
            const updatedCart = [...cart, { ...product, quantity: 1 }];
            console.log("장바구니에 새 상품을 담았습니다.", updatedCart);
            return { cart: updatedCart };
          }
        }),
      // 추후 여기에 removeFromCart, clearCart 등의 액션을 추가할 수 있습니다.
    }),
    {
      name: "cart-storage", // local storage에 저장될 때 사용될 키 이름입니다.
    }
  )
);

export default useCartStore;
