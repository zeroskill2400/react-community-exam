// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "멋진 키보드",
    description: "타건감이 뛰어난 기계식 키보드입니다. 개발자에게 최고의 선택!",
    price: 120000,
    imageUrl: "https://picsum.photos/id/237/200/300",
  },
  {
    id: 2,
    name: "편안한 마우스",
    description: "장시간 사용해도 손목이 편안한 인체공학적 디자인의 마우스.",
    price: 55000,
    imageUrl: "https://picsum.photos/id/238/200/300",
  },
  {
    id: 3,
    name: "고화질 모니터",
    description: "4K 해상도를 지원하여 선명하고 생생한 화면을 제공합니다.",
    price: 350000,
    imageUrl: "https://picsum.photos/id/239/200/300",
  },
  {
    id: 4,
    name: "노이즈 캔슬링 헤드폰",
    description:
      "주변 소음을 완벽하게 차단하여 작업에 몰입할 수 있게 해줍니다.",
    price: 280000,
    imageUrl: "https://picsum.photos/id/240/200/300",
  },
];

// API function to get products
export const getProducts = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real application, you would fetch this data from a server.
  // e.g., const { data, error } = await supabase.from('products').select('*');
  return mockProducts;
};
