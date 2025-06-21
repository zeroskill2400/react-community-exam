import "./index.css";

function App() {
  const posts = [
    {
      id: 1,
      title: "첫 번째 게시물",
      author: "작성자1",
      createdAt: "2024-05-21",
    },
    {
      id: 2,
      title: "두 번째 게시물",
      author: "작성자2",
      createdAt: "2024-05-20",
    },
    {
      id: 3,
      title: "세 번째 게시물",
      author: "작성자3",
      createdAt: "2024-05-19",
    },
    {
      id: 4,
      title: "네 번째 게시물",
      author: "작성자4",
      createdAt: "2024-05-18",
    },
    {
      id: 5,
      title: "다섯 번째 게시물",
      author: "작성자5",
      createdAt: "2024-05-17",
    },
    {
      id: 6,
      title: "여섯 번째 게시물",
      author: "작성자6",
      createdAt: "2024-05-16",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">게시물 목록</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">작성자: {post.author}</p>
            <p className="text-gray-400 text-sm">작성일: {post.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
