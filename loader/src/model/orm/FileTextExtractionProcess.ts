import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import {
  DBFileTextExtractionProcessType,
  FileTextExtractionProcessType,
} from '~/types/FileTextExtractionProcess';

const model = sequelize.define<
  Model<DBFileTextExtractionProcessType, FileTextExtractionProcessType>
>(
  'FileTextExtractionProcess',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    fileId: {
      field: 'fileId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    state: {
      field: 'state',
      type: DataTypes.ENUM(
        'NOT_STARTED',
        'EXTRACTING_TEXT',
        'WAITING_OCR',
        'EXECUTING_OCR',
        'ERRORED',
        'FINISHED',
      ),
      allowNull: false,
      defaultValue: 'NOT_STARTED',
    },
    errorDescription: {
      field: 'error_description',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: true,
    },
  },
  {
    modelName: 'FileTextExtractionProcess',
    tableName: 'file_text_extraction_processes',
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
