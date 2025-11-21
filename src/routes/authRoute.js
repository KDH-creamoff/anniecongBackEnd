const { Router } = require("express");
const authController = require("../controller/authController");
const { authenticate } = require("../utils/sessionAuth");
const { requirePermission } = require("../middleware/permissionMiddleware");
// const { uploadSignature, handleUploadError } = require("../middleware/signatureUploadMiddleware");

const router = Router();

// 로그인/회원가입은 인증 불필요
router.post("/login", authController.login);
router.post("/join", authController.signup);

// 로그아웃 및 본인 정보 조회는 인증만 필요
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);
router.get("/me/permissions", authenticate, authController.getMyPermissions);

// 사용자 관리 기능은 can_user_management 권한 필요
router.get("/", authenticate, requirePermission("can_user_management"), authController.getAllUsers);
router.get("/:id", authenticate, requirePermission("can_user_management"), authController.getUserById);
router.put("/:id", authenticate, requirePermission("can_user_management"), authController.updateUser);
router.delete("/:id", authenticate, requirePermission("can_user_management"), authController.deleteUser);

// 도장(서명) 관련 라우트
// router.post("/signature", authenticate, uploadSignature, handleUploadError, authController.uploadSignature);
// router.get("/signature", authenticate, authController.getSignature);

module.exports = router;
