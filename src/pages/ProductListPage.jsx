import { useEffect, useState } from "react";
import { getProducts } from "../apis/productApi";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // You can add error handling UI here
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <h1>상품 목록</h1>
      <div>
        {products.map((product) => (
          <div key={product.id}>
            <figure>
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </figure>
            <div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div>
                <span>{product.price.toLocaleString()}원</span>
                <button>상세보기</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
