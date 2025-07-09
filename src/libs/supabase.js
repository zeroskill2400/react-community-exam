import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
});

// 더 다양한 상품 데이터
const API_URL = "https://dummyjson.com";

// 상품 목록 (100개)
fetch("https://dummyjson.com/products?limit=100")
  .then((res) => res.json())
  .then((data) => console.log(data));

// 간단한 테스트 데이터
fetch("https://jsonplaceholder.typicode.com/posts")
  .then((res) => res.json())
  .then((data) => console.log(data));

// FakeStore API 데이터를 우리 DB 구조로 변환
const transformProductData = (apiProduct) => {
  return {
    name: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price * 1000, // 원화로 변환 (예: $10 → 10,000원)
    image_url: apiProduct.image,
    stock: Math.floor(Math.random() * 50) + 10, // 랜덤 재고
    category: apiProduct.category,
    is_active: true,
  };
};

export const fetchProductsFromAPI = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    return products.map((product) => ({
      name: product.title,
      description: product.description,
      price: Math.round(product.price * 1000), // 달러를 원화로 변환
      image_url: product.image,
      stock: Math.floor(Math.random() * 50) + 10,
      category: product.category,
      is_active: true,
    }));
  } catch (error) {
    console.error("상품 데이터 가져오기 실패:", error);
    throw error;
  }
};

export const insertProductsFromAPI = async () => {
  try {
    const products = await fetchProductsFromAPI();

    const { data, error } = await supabase.from("products").insert(products);

    if (error) throw error;

    console.log(`${products.length}개의 상품이 추가되었습니다.`);
    return data;
  } catch (error) {
    console.error("상품 데이터 삽입 실패:", error);
    throw error;
  }
};

const categories = [
  "men's clothing",
  "women's clothing",
  "jewelery",
  "electronics",
];

// 카테고리별 상품 가져오기
export const fetchProductsByCategory = async (category) => {
  const response = await fetch(
    `https://fakestoreapi.com/products/category/${category}`
  );
  return response.json();
};

/**
 * 장바구니에 상품 추가
 * @param {Object} param0
 * @param {string} user_id
 * @param {number} product_id
 * @param {number} quantity
 */
export const addToCart = async ({ user_id, product_id, quantity }) => {
  // 이미 담긴 상품이면 수량 증가, 아니면 새로 추가
  const { data: existing, error: fetchError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user_id)
    .eq("product_id", product_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

  if (existing) {
    // 이미 있으면 수량만 증가
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    if (error) throw error;
    return { ...existing, quantity: existing.quantity + quantity };
  } else {
    // 없으면 새로 추가
    const { data, error } = await supabase
      .from("cart_items")
      .insert([{ user_id, product_id, quantity }])
      .single();
    if (error) throw error;
    return data;
  }
};

/**
 * 장바구니에 가장 많이 담긴 상품 상위 랭킹을 가져온다.
 * @param {number} limit - 가져올 상품 개수
 */
export const fetchTopCartProducts = async (limit = 4) => {
  // cart_items 테이블에서 product_id별로 quantity 합계를 집계, 내림차순 정렬
  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, quantity")
    .order("quantity", { ascending: false })
    .limit(limit);

  if (error) throw error;

  // product 정보도 함께 가져오기
  const productIds = data.map((item) => item.product_id);
  if (productIds.length === 0) return [];

  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  if (prodError) throw prodError;

  // product 정보와 quantity를 합쳐서 반환
  return productIds.map((pid) => {
    const product = products.find((p) => p.id === pid);
    const cartItem = data.find((item) => item.product_id === pid);
    return {
      ...product,
      cart_count: cartItem ? cartItem.quantity : 0,
    };
  });
};
