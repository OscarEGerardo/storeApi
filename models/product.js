module.exports = function (sequelize, DataTypes) {
    var Product = sequelize.define("Product", {
        code: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Product.belongsTo(models.Promotion);
            }
        }
    });

    return Product;
}