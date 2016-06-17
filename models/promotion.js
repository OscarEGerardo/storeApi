module.exports = function (sequelize, DataTypes) {
    var Promotion = sequelize.define("Promotion", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            unique: true
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false
        }
    });

    return Promotion;
}