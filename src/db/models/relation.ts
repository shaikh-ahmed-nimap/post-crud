import sequelize from "../config";
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute, Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "sequelize";
import User from "./user";

class Relation extends Model<InferAttributes<Relation>, InferCreationAttributes<Relation>> {
    declare followerId:ForeignKey<User['userId']>;
    declare follwingId: ForeignKey<User['userId']>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;

    declare static associations: {

    }
}

Relation.init({
    // followerId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     references: {
    //         model: 'users',
    //         key: 'userId'
    //     },
    //     allowNull: false
    // },
    // follwingId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     references: {
    //         model: 'users',
    //         key: 'userId'
    //     },
    //     allowNull: false
    // },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    sequelize,
    modelName: 'Relation',
    paranoid: true
});

export default Relation; 