// models/ProductionOrders.js
export default (sequelize, DataTypes) => {
    const ProductionOrders = sequelize.define("ProductionOrders", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      order_no: { type: DataTypes.STRING(50), unique: true },
      status: { type: DataTypes.ENUM("대기중", "작업중", "완료"), allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE }
    }, { tableName: "ProductionOrders", timestamps: false });
    return ProductionOrders;
  };
  