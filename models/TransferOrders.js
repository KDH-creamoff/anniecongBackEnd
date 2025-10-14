// models/TransferOrders.js
export default (sequelize, DataTypes) => {
    const TransferOrders = sequelize.define("TransferOrders", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      status: { type: DataTypes.ENUM("출고준비", "이송중", "입고완료"), allowNull: false },
      source_plant: { type: DataTypes.STRING(50), allowNull: false },
      destination_plant: { type: DataTypes.STRING(50), allowNull: false },
      transport_method: { type: DataTypes.ENUM("트럭", "지게차", "기타") },
      item_code: { type: DataTypes.STRING(50), allowNull: false },
      item_name: { type: DataTypes.STRING(100), allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      lot_no: { type: DataTypes.STRING(50) },
      preparer: { type: DataTypes.STRING(50) },
      receiver: { type: DataTypes.STRING(50) },
      departure_time: { type: DataTypes.DATE },
      expected_arrival_time: { type: DataTypes.DATE },
      arrival_time: { type: DataTypes.DATE },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { tableName: "TransferOrders", timestamps: false });
    return TransferOrders;
  };
  