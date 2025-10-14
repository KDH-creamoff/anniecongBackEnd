// models/ManufacturingHistory.js
export default (sequelize, DataTypes) => {
    const ManufacturingHistory = sequelize.define("ManufacturingHistory", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      production_order_id: { type: DataTypes.INTEGER, references: { model: "ProductionOrders", key: "id" } },
      date: { type: DataTypes.DATE, allowNull: false },
      record: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { tableName: "ManufacturingHistory", timestamps: false });
    return ManufacturingHistory;
  };
  