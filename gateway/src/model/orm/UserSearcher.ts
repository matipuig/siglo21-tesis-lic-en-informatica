import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBUserSearcher } from '~/types/Searcher';

const model = sequelize.define<Model<DBUserSearcher, DBUserSearcher>>(
  'UserSearcher',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    searcherId: {
      field: 'searcher_id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    modelName: 'UserSearcher',
    tableName: 'user_searchers',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        fields: ['user_id', 'searcher_id'],
        unique: true,
        name: 'uniqueness',
      },
    ],
  },
);

export default model;
