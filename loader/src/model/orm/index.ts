import Source from './Source';
import Document from './Document';
import File from './File';
import FileTextExtractionProcess from './FileTextExtractionProcess';

Source.hasMany(Document, {
  foreignKey: 'sourceId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Document.belongsTo(Source, {
  foreignKey: 'sourceId',
});

Document.hasOne(File, {
  foreignKey: 'documentId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
File.belongsTo(Document, {
  foreignKey: 'documentId',
});

File.hasOne(FileTextExtractionProcess, {
  foreignKey: 'fileId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
FileTextExtractionProcess.belongsTo(File, {
  foreignKey: 'fileId',
});

export default { Source, Document, File, FileTextExtractionProcess };
