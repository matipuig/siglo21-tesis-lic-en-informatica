import { DataTypes, Model } from 'sequelize';

import sequelize from '~/model/db/sequelize';
import { DBDocumentType, NewDocumentType } from '~/types/Document';

const model = sequelize.define<Model<DBDocumentType, NewDocumentType>>(
  'Document',
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    sourceId: {
      field: 'source_id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sourceDocumentIdentifier: {
      field: 'source_document_identifier',
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    metadata: {
      field: 'metadata',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: false,
    },
    contentHash: {
      field: 'content_hash',
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      field: 'state',
      type: DataTypes.ENUM('NOT_STARTED', 'TEXT_EXTRACTED', 'ERRORED', 'FINISHED'),
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
    modelName: 'Document',
    tableName: 'documents',
    timestamps: true,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        fields: ['source_id', 'source_document_identifier'],
        unique: true,
      },
      { fields: ['content_hash'] },
    ],
  },
);

export default model;
