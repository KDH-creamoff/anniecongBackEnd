// models/index.js (제공해주신 코드)
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  config[env]
);

// 모델 로딩 함수
function loadModels(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadModels(fullPath);
    } else if (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    ) {
      const modelImport = require(fullPath);
      const modelFactory = modelImport.default || modelImport;

      if (typeof modelFactory === 'function') {
        const model = modelFactory(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      }
    }
  });
}

// 모델 로드
loadModels(__dirname);

// associate 호출
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
