// models/DailyProductionSummary.js
export default (sequelize, DataTypes) => {
    const DailyProductionSummary = sequelize.define("DailyProductionSummary", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      date: { type: DataTypes.DATE, unique: true },
      total_orders: { type: DataTypes.INTEGER, defaultValue: 0 },
      total_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
      completed_orders: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, { tableName: "DailyProductionSummary", timestamps: false });
    return DailyProductionSummary;
  };
  