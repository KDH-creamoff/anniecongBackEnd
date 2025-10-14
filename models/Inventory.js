// models/Inventory.js (CommonJS 스타일, sequelize 인자 받음)
'use strict';

const { INTEGER } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  try {
    const Inventory = sequelize.define('Inventory', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lot_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Available', 'Reserved', 'Expired'),
        defaultValue: 'Available',
      },
      registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storageType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      productTypeAndForm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ingredientAmount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ingredientName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      netWeight: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      feedPurpose: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      manufacturingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      precautions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      barcord: {
        type: INTEGER(14),
        allowNull: false
      }
    }, {
      tableName: 'Inventory',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

    // associate 함수: InventoryHistory와의 1:N 관계 무조건 설정 (hasMany)
    Inventory.associate = (models) => {
      Inventory.hasMany(models.InventoryHistory, {
        foreignKey: 'inventory_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };

    console.log('Inventory 모델이 성공적으로 초기화되었습니다.');
    return Inventory;
  } catch (e) {
    console.error("Inventory 모델 초기화 에러:", e.message, e.stack); // 로그 강화 (사용자 조건 무조건 추가)
    // 중복 응답 방지는 컨트롤러에서 적용되므로 여기서는 throw로 에러 전달
    throw e;
  }
};