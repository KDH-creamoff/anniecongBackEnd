// models/ProductionOrderDetails.js
export default (sequelize, DataTypes) => {
    const ProductionOrderDetails = sequelize.define("ProductionOrderDetails", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      production_order_id: { type: DataTypes.INTEGER, references: { model: "ProductionOrders", key: "id" } },
      product_name: { type: DataTypes.STRING(100), allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      due_date: { type: DataTypes.DATE }
    }, { tableName: "ProductionOrderDetails", timestamps: false });
    return ProductionOrderDetails;
  };
  