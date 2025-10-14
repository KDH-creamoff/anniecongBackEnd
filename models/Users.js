// models/Users.js
export default (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true },
    phone: { type: DataTypes.STRING(20) },
    plant: { type: DataTypes.ENUM("Plant1", "Plant2", "All"), allowNull: false },
    status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" },
    role: { type: DataTypes.INTEGER }, //1: CEO, 2: ADMIN, 3: TEAM_LEADER
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE }
  }, { tableName: "Users", timestamps: false });


  return Users;
};
