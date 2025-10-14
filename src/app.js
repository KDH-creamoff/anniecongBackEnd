// src/app.js
import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import db from "../models/index.js";
import indexRouter from "./routes/index.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import SequelizeStoreInit from "connect-session-sequelize";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// ✅ Sequelize 기반 세션 스토어 생성
const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  tableName: "sessions",
  expiration: 1000 * 60 * 60 * 24 * 7, // 7일
});

// ✅ HTTPS 인증서 로드
const httpsOptions = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
};

// ✅ CORS 설정
app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ 세션 미들웨어 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    },
  })
);

// ✅ 세션 테이블 동기화
await sessionStore.sync();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", indexRouter);

// ✅ CEO 기본값 ENUM 검증
const allowedPlants = ["Plant1", "Plant2", "All"];
let ceoPlant = process.env.CEO_PLANT || "All";
if (!allowedPlants.includes(ceoPlant)) {
  console.warn(
    `[경고] .env 파일의 CEO_PLANT="${process.env.CEO_PLANT}" 값이 잘못되었습니다. 허용된 값: ${allowedPlants.join(
      ", "
    )} → 기본값 'All'로 변경합니다.`
  );
  ceoPlant = "All";
}

const INITIAL_CEO = {
  username: process.env.CEO_USERNAME,
  password: process.env.CEO_PASSWORD,
  role: 1,
  name: process.env.CEO_NAME || "대표이사",
  plant: ceoPlant,
};

// ✅ CEO 계정 자동 생성 함수
async function createInitialCeoUser() {
  const Users = db.Users;
  if (!Users) {
    console.error("❌ Users 모델이 정의되어 있지 않습니다.");
    return;
  }

  const existing = await Users.findOne({
    where: { username: INITIAL_CEO.username },
  });
  if (existing) {
    console.log(`✅ 초기 CEO 계정(${INITIAL_CEO.username})이 이미 존재합니다.`);
    return;
  }

  if (!INITIAL_CEO.username || !INITIAL_CEO.password) {
    console.error("❌ CEO 계정의 username/password가 .env에 정의되어야 합니다.");
    return;
  }

  try {
    const hash = await bcrypt.hash(INITIAL_CEO.password, 10);
    await Users.create({
      username: INITIAL_CEO.username,
      password: hash,
      name: INITIAL_CEO.name,
      plant: INITIAL_CEO.plant,
      status: "Inactive",
      role: INITIAL_CEO.role,
      created_at: new Date(),
    });
    console.log(`✅ 초기 CEO 계정(${INITIAL_CEO.username}) 생성 완료.`);
  } catch (e) {
    if (
      e.name === "SequelizeDatabaseError" &&
      /Data truncated for column 'plant'/.test(e.message)
    ) {
      console.error(
        `❌ 'plant' 필드 값('${INITIAL_CEO.plant}')이 ENUM에 존재하지 않거나 길이 초과입니다.`,
        e
      );
    } else {
      console.error("❌ CEO 계정 생성 중 오류:", e);
    }
  }
}

// ✅ 서버 시작
async function startServer() {
  try {
    db.Inventory.hasMany(db.InventoryHistory, {
      foreignKey: "inventory_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    db.InventoryHistory.belongsTo(db.Inventory, {
      foreignKey: "inventory_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await db.sequelize.sync({ force: false });
    console.log("✅ 데이터베이스 테이블 동기화 완료.");

    await createInitialCeoUser();

    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`🚀 HTTPS 서버 실행 중: https://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("❌ 서버 시작 중 오류 발생:", e);
    process.exit(1);
  }
}

startServer();
