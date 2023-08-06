import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBResolucionType, ResolucionType } from '~/types/Resolucion';

const model = sequelize.define<Model<DBResolucionType, ResolucionType>>(
  'Resolucion',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    sourceId: {
      field: 'source_id',
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    fileName: {
      field: 'file_name',
      type: DataTypes.STRING(255),
    },
    fileHash: {
      field: 'file_hash',
      type: DataTypes.STRING(255),
    },
    year: {
      field: 'year',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    subject: {
      field: 'subject',
      type: DataTypes.STRING(255),
    },
    textContent: {
      field: 'text_content',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: true,
    },
  },
  {
    modelName: 'Resolucion',
    tableName: 'resoluciones',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        fields: ['year'],
      },
      { fields: ['subject'] },
    ],
  },
);

export default model;
