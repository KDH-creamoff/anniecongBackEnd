// models/QualityInspections.js
export default (sequelize, DataTypes) => {
    const QualityInspections = sequelize.define("QualityInspections", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      manufacturing_order_id: { type: DataTypes.INTEGER, references: { model: "ManufacturingOrders", key: "id" } },
      mo_number: { type: DataTypes.STRING(50) },
      process: { type: DataTypes.STRING(50) },
      item: { type: DataTypes.STRING(100), allowNull: false },
      standard_value: { type: DataTypes.STRING(50) },
      measured_value: { type: DataTypes.STRING(50) },
      result: { type: DataTypes.ENUM("합격", "불합격"), allowNull: false },
      inspector: { type: DataTypes.STRING(50) },
      inspection_time: { type: DataTypes.DATE, allowNull: false }
    }, { tableName: "QualityInspections", timestamps: false });
    return QualityInspections;
  };
  