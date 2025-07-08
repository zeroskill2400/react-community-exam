import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

const renderHeader = () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
};

describe("Header 컴포넌트", () => {
  it("로고 텍스트 'My Community'가 표시되어야 합니다.", () => {
    renderHeader();
    const logo = screen.getByText(/my community/i);
    expect(logo).toBeInTheDocument();
  });

  it("'로그인'과 '회원가입' 링크가 표시되어야 합니다.", () => {
    renderHeader();
    const loginLink = screen.getByRole("link", { name: /로그인/i });
    const signupLink = screen.getByRole("link", { name: /회원가입/i });
    expect(loginLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });
});
