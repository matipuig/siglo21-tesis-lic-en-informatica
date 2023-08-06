import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBOCRProcessType, OCRProcessType } from '~/types/OCRProcess';

const model = sequelize.define<Model<DBOCRProcessType, OCRProcessType>>(
  'OCRProcess',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      field: 'file_hash',
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    metadata: {
      field: 'metadata',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: false,
    },
    state: {
      field: 'state',
      type: DataTypes.ENUM({
        values: ['NOT_STARTED', 'STARTED', 'ERRORED', 'FINISHED'],
      }),
      defaultValue: 'NOT_STARTED',
      allowNull: false,
    },
    text: {
      field: 'text_content',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: true,
    },
    error: {
      field: 'error_description',
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    modelName: 'OCRProcess',
    tableName: 'ocr_processes',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        fields: ['state'],
      },
    ],
  },
);
export default model;
