import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../stores/userStore";
import { postPosts } from "../apis/postApi";

// 1. Zod로 유효성 검사 스키마 정의
const postSchema = z.object({
  title: z.string().min(3, "제목은 3글자 이상이어야 합니다."),
  content: z.string().min(10, "내용은 10글자 이상이어야 합니다."),
});

function WritePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const dataToValidate = { title, content };
    const result = postSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { user } = useUserStore.getState();
      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
      }

      const dataToSend = {
        ...result.data,
        userId: user.id,
      };

      await postPosts(dataToSend);

      navigate("/posts");
    } catch (error) {
      console.error("게시물 작성 중 에러 발생:", error);
      alert(error.message || "게시물 작성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">새 게시물 작성</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">제목</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            className={`input input-bordered w-full ${
              errors.title ? "input-error" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.title}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="content">
            <span className="label-text">내용</span>
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className={`textarea textarea-bordered h-48 w-full ${
              errors.content ? "textarea-error" : ""
            }`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
          {errors.content && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.content}
              </span>
            </label>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "게시물 작성"
          )}
        </button>
      </form>
    </div>
  );
}

export default WritePage;
