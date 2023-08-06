import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBSourceType, SourceType } from '~/types/Source';

const model = sequelize.define<Model<DBSourceType, SourceType>>(
  'Source',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      field: 'string',
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    microserviceUrl: {
      field: 'microservice_url',
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    modelName: 'Source',
    tableName: 'sources',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [],
  },
);

export default model;
