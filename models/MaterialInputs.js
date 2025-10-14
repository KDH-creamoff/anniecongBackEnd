// models/MaterialInputs.js
export default (sequelize, DataTypes) => {
    const MaterialInputs = sequelize.define("MaterialInputs", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      manufacturing_order_id: { type: DataTypes.INTEGER, references: { model: "ManufacturingOrders", key: "id" } },
      material_code: { type: DataTypes.STRING(50), allowNull: false },
      material_name: { type: DataTypes.STRING(100), allowNull: false },
      required_qty: { type: DataTypes.INTEGER, allowNull: false },
      input_qty: { type: DataTypes.INTEGER, defaultValue: 0 },
      progress: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
      scan_code: { type: DataTypes.STRING(100) }
    }, { tableName: "MaterialInputs", timestamps: false });
    return MaterialInputs;
  };
  