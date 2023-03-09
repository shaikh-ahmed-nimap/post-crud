import sequelize from "../config";
import bcrypt from 'bcrypt';
import crypto from "node:crypto";
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
import Relation from "./relation";

class User extends Model<InferAttributes<User, {omit: 'posts'}>, InferCreationAttributes<User, {omit: 'posts'}>> implements Model {
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
    declare resetToken: string | null;
    declare resetTokenExpires: number | null;
    declare posts?: NonAttribute<Post[]>;

    declare getPosts: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
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
    };
    declare validatePassword:NonAttribute<(password: string, passwordToCompare:string) => Promise<boolean>>;

    static async hashPassword (password:string) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    };

    async createResetToken () {
        const resetToken = crypto.randomBytes(10).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.resetToken = hashedResetToken;
        this.resetTokenExpires = Date.now() + 5 * 60 * 1000;
        await this.save();
        console.log(this.resetToken);
        return resetToken;
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
    deletedAt: DataTypes.DATE,
    resetToken: {
        type: DataTypes.STRING,
    },
    resetTokenExpires: {
        type: DataTypes.BIGINT
    }
}, {sequelize, paranoid: true});

User.hasMany(Post, {sourceKey: 'userId',foreignKey: 'ownerId', as: 'owner', onDelete: 'CASCADE'});
Post.belongsTo(User, {as: "owner", foreignKey: 'ownerId', targetKey: 'userId'});

User.belongsToMany(User, {foreignKey: "followerId", through: Relation, as: "followers", targetKey: 'userId'});
User.belongsToMany(User, {foreignKey: "followingId", through: Relation,as: "following", targetKey: 'userId'});

User.prototype.validatePassword = async (password: string, passwordToCompare: string) => {
    const isMatch  = await bcrypt.compare(password, passwordToCompare);
    return isMatch;
};

export default User;
