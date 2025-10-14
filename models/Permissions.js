// models/Permissions.js
export default (sequelize, DataTypes) => {
    const Permissions = sequelize.define("Permissions", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      role_id: { type: DataTypes.INTEGER},
      manage_basic_info: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_preprocessing: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_manufacturing: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_label: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_quality: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_inbound: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_transfer: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_outbound: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_inventory: { type: DataTypes.BOOLEAN, defaultValue: false },
      manage_users: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE }
    }, { tableName: "Permissions", timestamps: false });
    return Permissions;
  };
  