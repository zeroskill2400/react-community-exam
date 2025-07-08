import useCartStore from "../stores/cartStore";
import { Link } from "react-router-dom";

function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  if (cart.length === 0) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          장바구니
        </h1>
        <p style={{ marginBottom: "1rem" }}>장바구니가 비어있습니다.</p>
        <Link to="/products">
          <button>상품 보러가기</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        장바구니
      </h1>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", marginBottom: "1.5rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>상품</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>이름</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>가격</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>수량</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>
                수량 조절
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: "0.5rem" }}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td style={{ padding: "0.5rem" }}>{item.name}</td>
                <td style={{ padding: "0.5rem" }}>
                  {item.price.toLocaleString()}원
                </td>
                <td style={{ padding: "0.5rem" }}>{item.quantity}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    -
                  </button>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CartPage;
