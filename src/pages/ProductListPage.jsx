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
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">상품 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                src={product.image_url}
                alt={product.name}
                className="h-56 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <div className="card-actions justify-end items-center mt-2">
                <span className="text-lg font-semibold">
                  {product.price.toLocaleString()}원
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    console.log(`${product.name}을(를) 장바구니에 담았습니다.`)
                  }
                >
                  장바구니에 담기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
