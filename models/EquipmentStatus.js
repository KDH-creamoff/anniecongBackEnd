// models/EquipmentStatus.js
export default (sequelize, DataTypes) => {
    const EquipmentStatus = sequelize.define("EquipmentStatus", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      equipment_name: { type: DataTypes.STRING(100), allowNull: false },
      status: { type: DataTypes.ENUM("대기", "진행중", "정지"), allowNull: false },
      utilization: { type: DataTypes.DECIMAL(5,2) },
      current_job: { type: DataTypes.STRING(100) },
      next_job: { type: DataTypes.STRING(100) }
    }, { tableName: "EquipmentStatus", timestamps: false });
    return EquipmentStatus;
  };
  