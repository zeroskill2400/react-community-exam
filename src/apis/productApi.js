import { supabase } from "../libs/supabase";

/**
 * FakeStore API에서 상품 데이터를 가져옵니다.
 * @returns {Promise<Array>} 상품 목록
 */
export const fetchProductsFromAPI = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("API 요청 실패");
    }

    const products = await response.json();

    // API 데이터를 우리 DB 구조로 변환
    return products.map((product) => ({
      name: product.title,
      description: product.description,
      price: Math.round(product.price * 1000), // 달러를 원화로 변환
      image_url: product.image,
      stock: Math.floor(Math.random() * 50) + 10, // 랜덤 재고 (10-59개)
      category: product.category,
      is_active: true,
    }));
  } catch (error) {
    console.error("상품 데이터 가져오기 실패:", error);
    throw error;
  }
};

/**
 * API에서 가져온 상품 데이터를 Supabase에 삽입합니다.
 * @returns {Promise<Object>} 삽입 결과
 */
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

/**
 * 특정 카테고리의 상품을 API에서 가져옵니다.
 * @param {string} category - 카테고리명
 * @returns {Promise<Array>} 카테고리별 상품 목록
 */
export const fetchProductsByCategoryFromAPI = async (category) => {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );
    if (!response.ok) {
      throw new Error("카테고리 API 요청 실패");
    }

    const products = await response.json();

    return products.map((product) => ({
      name: product.title,
      description: product.description,
      price: Math.round(product.price * 1000),
      image_url: product.image,
      stock: Math.floor(Math.random() * 50) + 10,
      category: product.category,
      is_active: true,
    }));
  } catch (error) {
    console.error("카테고리별 상품 데이터 가져오기 실패:", error);
    throw error;
  }
};

/**
 * Supabase에서 상품 목록을 가져옵니다.
 * @param {number} page - 페이지 번호
 * @param {number} limit - 페이지당 상품 수
 * @returns {Promise<Object>} 상품 목록과 총 개수
 */
export const fetchProducts = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    products: data ?? [],
    totalCount: count ?? 0,
  };
};

/**
 * 특정 상품의 상세 정보를 가져옵니다.
 * @param {number} id - 상품 ID
 * @returns {Promise<Object>} 상품 상세 정보
 */
export const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * 카테고리별 상품을 가져옵니다.
 * @param {string} category - 카테고리명
 * @returns {Promise<Array>} 카테고리별 상품 목록
 */
export const fetchProductsByCategory = async (category) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

/**
 * 상품 검색을 수행합니다.
 * @param {string} searchTerm - 검색어
 * @returns {Promise<Array>} 검색 결과
 */
export const searchProducts = async (searchTerm) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};
