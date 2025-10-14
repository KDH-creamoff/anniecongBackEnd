// models/InventoryDashboard.js
export default (sequelize, DataTypes) => {
    const InventoryDashboard = sequelize.define("InventoryDashboard", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: { type: DataTypes.DATE, unique: true },
      total_items: { type: DataTypes.INTEGER, defaultValue: 0 },
      low_stock_items: { type: DataTypes.INTEGER, defaultValue: 0 },
      near_expiration_items: { type: DataTypes.INTEGER, defaultValue: 0 },
      avg_turnover_days: { type: DataTypes.INTEGER },
      warehouse_utilization: { type: DataTypes.JSON },
      category_distribution: { type: DataTypes.JSON }
    }, { tableName: "InventoryDashboard", timestamps: false });
    return InventoryDashboard;
  };
  