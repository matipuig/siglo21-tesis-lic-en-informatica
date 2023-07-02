/**
 * @packageDocumentation
 * @module Model/ORM/FileTextExtractionProcess
 * It contains file text extraction process model.
 */

import { DataTypes } from 'sequelize';

import MODELS from '~/constants/model';
import sequelize from '~/model/db/sequelize';

const model = sequelize.define(
  MODELS.OCR_FILE.NAME,
  {
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      field: 'hash',
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    state: {
      field: 'state',
      type: DataTypes.ENUM({
        values: ['NOT_STARTED', 'STARTED', 'ERRORED', 'FINISHED'],
      }),
      defaultValue: 'NOT_STARTED',
      allowNull: false,
    },
    extractionStartedAt: {
      field: 'extraction_started_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
    percentageCompleted: {
      field: 'percentage_completed',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        max: {
          args: [100],
          msg: 'Cannot be more than 100 percent!',
        },
        min: {
          args: [0],
          msg: 'Cannot be less than zero percentage!',
        },
      },
    },
    extractedAt: {
      field: 'extracted_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastAskingDate: {
      field: 'last_asking_date',
      type: DataTypes.DATE,
      allowNull: false,
    },
    text: {
      field: 'text',
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: true,
    },
    error: {
      field: 'error',
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    modelName: MODELS.OCR_FILE.NAME,
    tableName: MODELS.OCR_FILE.DB_TABLE_OR_COLLECTION,
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
