/**
 * @packageDocumentation
 * @module Types/File
 * The files types
 */

export type FileType = {
  id?: string;
  hash: string;
  state: string;
  lastAskingDate: Date;
  error?: string;
  text?: string;
  extractionStartedAt?: Date;
  percentageCompleted?: number;
  extractedAt?: Date;
};
