/**
 * 세션 인증 유틸리티
 * - 세션 생성 및 관리
 * - 인증 미들웨어
 */

/**
 * 사용자 세션 생성
 * @param {Object} req - Express 요청 객체
 * @param {Object} user - 사용자 정보
 * @returns {Promise<void>}
 */
async function createSession(req, user) {
  // 기존 세션을 재생성하여 보안 강화
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        reject(new Error("세션 생성 중 오류가 발생했습니다"));
        return;
      }
      
      // 새 세션에 사용자 정보 설정
      req.session.userId = user.id;
      req.session.username = user.username || user.id;
      req.session.createdAt = Date.now();
      
      // 세션 저장
      req.session.save((error) => {
        if (error) {
          reject(new Error("세션 저장 중 오류가 발생했습니다"));
        } else {
          resolve();
        }
      });
    });
  });
}

/**
 * 세션 기반 인증 미들웨어
 * - 로그인 여부 확인
 * - 세션 만료 확인
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
async function authenticate(req, res, next) {
  try {
    // 세션 존재 여부 확인
    if (!req.session || !req.session.userId) {
      console.log("[Session] No session or userId found", {
        hasSession: !!req.session,
        userId: req.session?.userId,
        sessionId: req.sessionID
      });
      return res.status(401).json({ 
        ok: false,
        message: "로그인이 필요합니다" 
      });
    }

    // createdAt이 없으면 현재 시간으로 설정 (하위 호환성)
    if (!req.session.createdAt) {
      req.session.createdAt = Date.now();
      req.session.save(() => {}); // 비동기 저장 (에러 무시)
    }

    // 세션 만료 확인 (7일)
    const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
    const currentTime = Date.now();
    const sessionAge = currentTime - req.session.createdAt;

    if (sessionAge > SESSION_MAX_AGE) {
      console.log("[Session] Session expired", {
        userId: req.session.userId,
        sessionAge: sessionAge,
        maxAge: SESSION_MAX_AGE
      });
      // 만료된 세션 삭제
      req.session.destroy(() => {});
      
      return res.status(401).json({ 
        ok: false,
        message: "세션이 만료되었습니다. 다시 로그인해주세요" 
      });
    }

    // 세션 갱신 (rolling 옵션이 활성화되어 있으면 자동으로 갱신됨)
    // 추가로 세션을 저장하여 지속성 보장
    req.session.save((err) => {
      if (err) {
        console.error("[Session] Failed to save session:", err);
      }
    });

    // 인증 성공 - 다음 미들웨어로 진행
    next();
    
  } catch (error) {
    console.error("========== 세션 인증 에러 ==========");
    console.error(error);
    console.error("====================================");
    
    res.status(500).json({ 
      ok: false,
      message: "인증 처리 중 서버 오류가 발생했습니다" 
    });
  }
}

module.exports = {
  createSession,
  authenticate,
};
