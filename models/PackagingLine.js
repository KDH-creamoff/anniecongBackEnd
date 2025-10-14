// models/PackagingLine.js
export default (sequelize, DataTypes) => {
    const PackagingLine = sequelize.define("PackagingLine", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      current_job: { type: DataTypes.STRING(100) },
      packaging_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      label_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      speed: { type: DataTypes.DECIMAL(5,2) }
    }, { tableName: "PackagingLine", timestamps: false });
    return PackagingLine;
  };
  