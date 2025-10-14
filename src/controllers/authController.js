// src/controllers/authController.js
import db from "../../models/index.js";
import bcrypt from "bcryptjs";

// 회원가입(회원 생성)
export const signin = async (req, res) => {
  try {
    const { username, password, name, email, phone, plant } = req.body;

    // 필수값 체크
    if (!username || !password || !name || !email || !phone || !plant) {
      return res.status(400).json({
        message: "값이 누락 되었습니다.",
      });
    }

    // Users 모델 가져오기 (db.Users)
    const Users = db.Users;

    // username 중복 체크
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        message: "이미 사용 중인 아이디입니다.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await Users.create({
      username: username,
      password: hash,
      name: name,
      phone: phone,
      email: email,
      plant: plant,
      status: "Inactive",
      role: 4,
      created_at: new Date(),
    });

    return res.status(200).json({
      message: "성공적으로 생성 되었습니다.",
    });
  } catch (e) {
    // SequelizeUniqueConstraintError 처리
    if (
      e.name === "SequelizeUniqueConstraintError" ||
      (e.parent && e.parent.code === "ER_DUP_ENTRY")
    ) {
      return res.status(409).json({
        message: "이미 사용 중인 아이디입니다.",
      });
    }
    console.log(e);
    return res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "아이디와 비밀번호를 입력하세요." });
    }

    const user = await db.Users.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
    }

    // status를 'Active'로 변경
    await db.Users.update(
      {
        status: "Active",
        updated_at: new Date()
      },
      {
        where: { id: user.id }
      }
    );

    // 세션에 유저 정보 저장
    req.session.user = {
      id: user.id,
      username: user.username,
      role_id: user.role,
    };

    return res.status(200).json({
      message: "로그인 성공",
      user: req.session.user,
    });
  } catch (err) {
    console.error("login 에러:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 세션 인증 미들웨어
export const verifySession = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  next();
};

// 세션에서 유저 정보 반환
export const getProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  return res.status(200).json({ user: req.session.user });
};

// 로그아웃
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("logout 에러:", err);
      return res.status(500).json({ message: "로그아웃 실패" });
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({ message: "로그아웃 성공" });
  });
};
