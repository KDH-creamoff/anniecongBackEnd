// models/AccessLogs.js
export default (sequelize, DataTypes) => {
    const AccessLogs = sequelize.define("AccessLogs", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, references: { model: "Users", key: "id" } },
      access_time: { type: DataTypes.DATE, allowNull: false },
      action: { type: DataTypes.STRING(100), allowNull: false },
      module: { type: DataTypes.STRING(50), allowNull: false },
      ip_address: { type: DataTypes.STRING(45) },
      result: { type: DataTypes.ENUM("성공", "실패"), allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { tableName: "AccessLogs", timestamps: false });
    return AccessLogs;
  };
  