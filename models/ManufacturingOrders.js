// models/ManufacturingOrders.js
export default (sequelize, DataTypes) => {
    const ManufacturingOrders = sequelize.define("ManufacturingOrders", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      target: { type: DataTypes.INTEGER, allowNull: false },
      produced: { type: DataTypes.INTEGER, defaultValue: 0 },
      workers: { type: DataTypes.STRING(200) },
      recipe: { type: DataTypes.STRING(100) },
      start_time: { type: DataTypes.DATE },
      expected_end_time: { type: DataTypes.DATE },
      progress: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
      status: { type: DataTypes.ENUM("준비", "진행중", "완료"), allowNull: false }
    }, { tableName: "ManufacturingOrders", timestamps: false });
    return ManufacturingOrders;
  };
  