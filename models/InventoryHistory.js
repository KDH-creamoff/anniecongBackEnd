// models/InventoryHistory.js (CommonJS 스타일, sequelize 인자 받음)
'use strict';

module.exports = (sequelize, DataTypes) => {
  const InventoryHistory = sequelize.define('InventoryHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,  // NULL 허용 안 함 (안정성 위해 무조건 설정)
      references: {
        model: 'Inventory',  // Inventory 테이블 무조건 참조
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    type: {
      type: DataTypes.ENUM('입고', '출고', '이동', '조정'),
      allowNull: false,
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
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    destination: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    manager: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'InventoryHistory',
    timestamps: false,  // created_at 없으므로 false
  });

  // associate 함수: Inventory와의 N:1 관계 무조건 설정 (belongsTo)
  InventoryHistory.associate = (models) => {
    InventoryHistory.belongsTo(models.Inventory, {
      foreignKey: 'inventory_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return InventoryHistory;
};