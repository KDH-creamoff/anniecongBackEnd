// models/ColdStorage.js
export default (sequelize, DataTypes) => {
    const ColdStorage = sequelize.define("ColdStorage", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      temperature: { type: DataTypes.DECIMAL(5,2), allowNull: false },
      storage_qty: { type: DataTypes.INTEGER, defaultValue: 0 },
      main_items: { type: DataTypes.JSON }
    }, { tableName: "ColdStorage", timestamps: false });
    return ColdStorage;
  };