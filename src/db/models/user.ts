import sequelize from "../config";
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, HasManyGetAssociationsMixin,
HasManyAddAssociationMixin,
HasManyAddAssociationsMixin,
HasManySetAssociationsMixin,
HasManyRemoveAssociationMixin,
HasManyRemoveAssociationsMixin,
HasManyHasAssociationMixin,
HasManyHasAssociationsMixin,
HasManyCountAssociationsMixin,
HasManyCreateAssociationMixin,
Association} from "sequelize";
import Post from "./post";

class User extends Model<InferAttributes<User, {omit: 'posts'}>, InferCreationAttributes<User, {omit: 'posts'}>> {
    declare userId: number
    declare firstName?: string
    declare lastName?:string
    declare username: string
    declare email: string
    declare password:string
    declare profilePic?: string
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare deletedAt: CreationOptional<Date>
    declare posts?: NonAttribute<Post[]>;

    declare getProjects: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
    declare addPost: HasManyAddAssociationMixin<Post, number>;
    declare addPosts: HasManyAddAssociationsMixin<Post, number>;
    declare setPosts: HasManySetAssociationsMixin<Post, number>;
    declare removePost: HasManyRemoveAssociationMixin<Post, number>;
    declare removePosts: HasManyRemoveAssociationsMixin<Post, number>;
    declare hasPost: HasManyHasAssociationMixin<Post, number>;
    declare hasPosts: HasManyHasAssociationsMixin<Post, number>;
    declare countPosts: HasManyCountAssociationsMixin;
    declare createPost: HasManyCreateAssociationMixin<Post, 'ownerId'>;

    declare static associations: {
        posts: Association<User, Post>
    }
};

User.init({
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePic: {
        type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {sequelize, paranoid: true});

User.hasMany(Post, {sourceKey: 'userId',foreignKey: 'ownerId', as: 'posts', onDelete: 'CASCADE'});

export default User;
