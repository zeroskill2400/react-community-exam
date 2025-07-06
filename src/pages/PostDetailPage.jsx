import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase";
import { useUserStore } from "../stores/userStore";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
  isCommentAuthor,
} from "../apis/commentApi";

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  // 게시글과 댓글 데이터 로드
  useEffect(() => {
    const loadPostData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 게시글 데이터 로드
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select(
            `
            id, title, content, created_at,
            users(email)
          `
          )
          .eq("id", id)
          .single();

        if (postError) throw postError;

        // 댓글 데이터 로드 (API 함수 사용)
        const commentsData = await fetchComments(id);

        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
        console.error("데이터 로드 중 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostData();
  }, [id]);

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    if (!newComment.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const newCommentData = await createComment({
        post_id: id,
        user_id: user.id,
        content: newComment.trim(),
      });

      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (err) {
      console.error("댓글 작성 중 오류:", err);
      alert("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingComment(null);
    setEditContent("");
  };

  // 댓글 수정 제출
  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const updatedComment = await updateComment(commentId, editContent.trim());

      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );

      setEditingComment(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 중 오류:", err);
      alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 중 오류:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 댓글 작성자 확인
  const checkCommentAuthor = async (commentId) => {
    try {
      return await isCommentAuthor(commentId, user.id);
    } catch (err) {
      console.error("작성자 확인 중 오류:", err);
      return false;
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        에러: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-4 text-center">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => navigate("/posts")} className="btn btn-ghost mb-4">
        ← 목록으로 돌아가기
      </button>

      {/* 게시글 내용 */}
      <div className="bg-base-100 shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500 mb-4">
          <span>작성자: {post.users?.email || "익명"}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-base-100 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">댓글 ({comments.length})</h2>

        {/* 댓글 목록 */}
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              아직 댓글이 없습니다.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-semibold text-sm">
                      {comment.users?.email || "익명"}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {user && comment.users?.email === user.email && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(comment)}
                        className="btn btn-xs btn-outline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="btn btn-xs btn-error"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="textarea textarea-bordered w-full h-20"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(comment.id)}
                        className="btn btn-xs btn-primary"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="btn btn-xs btn-ghost"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* 댓글 작성 폼 */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">댓글 작성</span>
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="textarea textarea-bordered w-full h-24"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              댓글 작성
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-outline btn-sm"
            >
              로그인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
