import mongoose from 'mongoose';

const serverlessFunctionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  functionName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const ServerlessFunction = mongoose.model('ServerlessFunction', serverlessFunctionSchema);

export default ServerlessFunction;