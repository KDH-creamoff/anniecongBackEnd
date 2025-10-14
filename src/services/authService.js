// src/services/authService.js (ES 모듈 스타일, 함수 무조건 구현)
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';  // db 무조건 import (Inventory/Roles 연동)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';  // .env 무조건 확인

// loginOrSignUp 함수: 로그인 또는 가입 로직 (기존 호출 무조건 구현, 가입 로직 추가 필요 시 확장)
export const loginOrSignUp = async (userData) => {
  const { username, password, name, email, phone, plant, role_id, inventory_id } = userData;  // inventory_id/role_id 무조건 포함

  let user = await db.Users.findOne({ where: { username } });

  if (!user) {
    // 가입 로직 (신규 사용자 무조건 생성, inventory_id/role_id 무조건 추가)
    const hash = await bcrypt.hash(password, 10);
    user = await db.Users.create({
      username,
      password: hash,
      name,
      email,
      phone,
      plant,
      status: 'Active',
      role_id,  // 무조건 추가 (Roles 참조, onDelete: 'CASCADE')
      inventory_id,  // 무조건 추가 (Inventory 참조, onDelete: 'CASCADE')
      created_at: new Date(),
    });
    console.log('✅ 신규 사용자 생성 완료 (inventory_id/role_id 포함)');
  } else {
    // 로그인 검증
    const passwordMatch = await user.validPassword(password);
    if (!passwordMatch) {
      throw new Error('비밀번호 불일치');
    }
  }

  return user;  // 사용자 반환 (토큰 생성은 authController에서)
};

// refreshAccessToken 함수: 리프레시 토큰 검증 및 새 액세스 토큰 발급 (정상화 무조건)
export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await db.Users.findByPk(decoded.id, {
      include: [
        { model: db.Roles },  // role_id 무조건 포함
        { model: db.Inventory },  // inventory_id 무조건 포함 (연동 보장)
      ],
    });

    if (!user || user.refreshToken !== refreshToken || !user.refreshTokenExpiresAt || new Date(user.refreshTokenExpiresAt) < new Date()) {
      throw new Error('RefreshToken 만료 또는 불일치');
    }

    // 새 액세스 토큰 생성 (inventory_id/role_id 무조건 페이로드 포함)
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, role_id: user.role_id, inventory_id: user.inventory_id },
      JWT_SECRET,
      { expiresIn: `${ACCESS_TOKEN_EXPIRES_MINUTES}m` }
    );

    // DB 업데이트 (액세스 토큰/만료 시간 무조건)
    await user.update({
      accessToken: newAccessToken,
      accessTokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE),
    });

    return { user, token: newAccessToken };
  } catch (error) {
    throw new Error('RefreshToken 재발급 실패: ' + error.message);
  }
};

// getUserFromToken 함수: 토큰에서 사용자 조회 (재발급 필요 시 처리, 정상화 무조건)
export const getUserFromToken = async (accessToken, refreshToken) => {
  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const user = await db.Users.findByPk(decoded.id, {
      include: [
        { model: db.Roles },  // role_id 무조건 포함
        { model: db.Inventory },  // inventory_id 무조건 포함 (연동 보장)
      ],
    });

    if (!user || user.accessToken !== accessToken || !user.accessTokenExpiresAt || new Date(user.accessTokenExpiresAt) < new Date()) {
      if (refreshToken) {
        // 재발급 호출
        const { user: refreshedUser, token } = await refreshAccessToken(refreshToken);
        return { user: refreshedUser, refreshed: true };
      } else {
        throw new Error('AccessToken 만료, RefreshToken 없음');
      }
    }

    return { user, refreshed: false };
  } catch (error) {
    throw new Error('Token 사용자 조회 실패: ' + error.message);
  }
};