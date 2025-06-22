// 100개의 게시물 데이터를 생성하는 함수
const generatePosts = () => {
  const posts = [];
  for (let i = 1; i <= 100; i++) {
    const post = {
      id: i,
      title: `게시물 제목 ${i}`,
      author: `작성자${(i % 10) + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30)
        .toISOString()
        .split("T")[0], // 최근 30일 내 랜덤 날짜
    };
    posts.push(post);
  }
  return posts.sort((a, b) => a.id - b.id); // 최신순으로 정렬
};

// 생성된 데이터를 export 합니다.
export const posts = generatePosts();
