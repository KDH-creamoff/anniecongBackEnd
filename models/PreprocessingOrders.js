// models/PreprocessingOrders.js
export default (sequelize, DataTypes) => {
    const PreprocessingOrders = sequelize.define("PreprocessingOrders", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      status: { type: DataTypes.ENUM("대기", "진행중", "완료"), allowNull: false },
      worker: { type: DataTypes.STRING(50) },
      target: { type: DataTypes.INTEGER },
      start_time: { type: DataTypes.DATE },
      pause_time: { type: DataTypes.DATE },
      yield_label: { type: DataTypes.STRING(100) },
      raw_materials: { type: DataTypes.JSON },
      scan_code: { type: DataTypes.STRING(100) },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { tableName: "PreprocessingOrders", timestamps: false });
    return PreprocessingOrders;
  };
  