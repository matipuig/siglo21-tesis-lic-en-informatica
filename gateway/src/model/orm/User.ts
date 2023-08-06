import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBUserType, UserType } from '~/types/User';

const model = sequelize.define<Model<DBUserType, UserType>>(
  'User',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user: {
      field: 'user',
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      field: 'password',
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [],
  },
);

export default model;
