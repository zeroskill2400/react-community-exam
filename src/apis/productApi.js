import { supabase } from "../libs/supabase";

// API function to get products
export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }

  // In a real application, you would fetch this data from a server.
  // e.g., const { data, error } = await supabase.from('products').select('*');
  return data;
};
