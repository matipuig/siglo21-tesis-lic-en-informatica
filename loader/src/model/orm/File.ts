import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBFileType, FileType } from '~/types/File';

const model = sequelize.define<Model<DBFileType, FileType>>(
  'File',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    documentId: {
      field: 'document_id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    fileName: {
      field: 'file_name',
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    fileExtension: {
      field: 'file_extension',
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    fileHash: {
      field: 'file_hash',
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    textContent: {
      field: 'text_content',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: true,
    },
  },
  {
    modelName: 'File',
    tableName: 'files',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        fields: ['document_id', 'file_name'],
      },
      {
        fields: ['file_hash'],
      },
    ],
  },
);

export default model;
