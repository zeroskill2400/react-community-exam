import useCartStore from "../stores/cartStore";
import { Link } from "react-router-dom";

function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart); // 삭제 기능을 위해 추가

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">장바구니</h1>
        <p className="mb-4">장바구니가 비어있습니다.</p>
        <Link to="/products" className="btn btn-primary">
          상품 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">장바구니</h1>

      <div className="overflow-x-auto">
        <table className="table w-full mb-6">
          <thead>
            <tr>
              <th>상품</th>
              <th>이름</th>
              <th>가격</th>
              <th>수량</th>
              <th>합계</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()}원</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="btn btn-sm"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="btn btn-sm"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{(item.price * item.quantity).toLocaleString()}원</td>
                <td>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-ghost"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center bg-base-200 p-4 rounded-lg gap-4">
        <div>
          <button onClick={clearCart} className="btn btn-outline btn-error">
            장바구니 비우기
          </button>
        </div>
        <div className="text-center md:text-right">
          <p className="text-2xl font-bold">
            총액: {totalPrice.toLocaleString()}원
          </p>
          <button className="btn btn-primary mt-2">결제하기</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
