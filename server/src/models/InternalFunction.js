// server/src/models/InternalFunction.js

import mongoose from 'mongoose';

const InternalFunctionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  projectId: {
    type: String,
    required: false, // System functions won't have a projectId
    index: true
  },
  code: {
    type: String,
    required: true,
  }, exampleUsage: {
    type: String,
    required: true,
  },
  docs: {
    type: String,
    required: true,
  },
  libraries: {
    type: [String], // Array of strings for library names
    default: [],
  },
}, {
  timestamps: true
});

const InternalFunctionModel = mongoose.model('InternalFunction', InternalFunctionSchema);

export default InternalFunctionModel;