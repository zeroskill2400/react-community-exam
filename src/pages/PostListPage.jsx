function PostListPage() {
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
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">자유 게시판</h1>
        <p className="text-gray-500">다양한 이야기를 나눠보세요.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="hover">
                <th>{post.id}</th>
                <td>
                  <a href="#" className="link link-hover">
                    {post.title}
                  </a>
                </td>
                <td>{post.author}</td>
                <td>{post.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="join">
          <button className="join-item btn">«</button>
          <button className="join-item btn btn-active">1</button>
          <button className="join-item btn">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">»</button>
        </div>
        <button className="btn btn-primary">글쓰기</button>
      </div>
    </div>
  );
}

export default PostListPage;
