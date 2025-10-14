import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";
const ACCESS_TOKEN_EXPIRES = "15m"; // AccessToken 유효기간: 15분
const REFRESH_TOKEN_EXPIRES = "30d"; // RefreshToken 유효기간: 30일

// AccessToken 생성
export const signAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRES });
};

// RefreshToken 생성
export const signRefreshToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES });
};

// 토큰 검증
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("토큰이 만료되었습니다.");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("유효하지 않은 토큰입니다.");
    } else {
      throw new Error("토큰 검증 중 오류가 발생했습니다.");
    }
  }
};