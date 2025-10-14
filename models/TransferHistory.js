// models/TransferHistory.js
export default (sequelize, DataTypes) => {
    const TransferHistory = sequelize.define("TransferHistory", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      transfer_id: { type: DataTypes.INTEGER, references: { model: "TransferOrders", key: "id" } },
      time: { type: DataTypes.DATE, allowNull: false },
      action: { type: DataTypes.ENUM("출고", "이송", "입고"), allowNull: false },
      remark: { type: DataTypes.TEXT }
    }, { tableName: "TransferHistory", timestamps: false });
    return TransferHistory;
  };
  