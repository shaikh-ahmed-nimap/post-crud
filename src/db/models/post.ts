import sequelize from "../config";
import {Sequelize, Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute, Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin} from "sequelize";
import User from "./user";


class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare postId: number;
    declare title: string;
    declare description: string;
    declare image: string | null;
    declare slug: string;
    declare ownerId: ForeignKey<User['userId']>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare owner?: NonAttribute<User>;

    declare createUser: BelongsToCreateAssociationMixin<User>;
    declare getUser: BelongsToGetAssociationMixin<User>;
    declare setUser: BelongsToSetAssociationMixin<User, 'ownerId'>;

    declare static associations: {
        owner: Association<Post, User>
    }
};

Post.init({
    postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    slug: {
        type: DataTypes.STRING
    },
    ownerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "userId"
        }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
}, {
    sequelize, modelName: 'Post', paranoid: true
});


export default Post;