import mongoose from 'mongoose';

const schemaModelSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  schemas: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

const SchemaModel = mongoose.model('SchemaModel', schemaModelSchema);
export default SchemaModel;