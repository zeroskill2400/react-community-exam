import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const dataToValidate = { title, content };
    const result = postSchema.safeParse(dataToValidate);
    console.log("result", result);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      console.log("fieldErrors", fieldErrors);
      return;
    }
    setErrors({});

    try {
      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        throw new Error("서버에서 게시물 생성에 실패했습니다.");
      }

      navigate("/posts");
    } catch (error) {
      console.error("게시물 작성 중 에러 발생:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
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
          />
          {errors.content && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.content}
              </span>
            </label>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          게시물 작성
        </button>
      </form>
    </div>
  );
}

export default WritePage;
