// server/src/models/UsageMetric.js

import mongoose from 'mongoose';

const usageMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Can also link to the specific project
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number, // in milliseconds
      required: true,
    },
    // Optionally, you can log data transfer sizes
    requestSize: {
      type: Number, // in bytes
    },
    responseSize: {
      type: Number, // in bytes
    },
  },
  {
    timestamps: true,
  }
);

// Create an index for faster queries, for example, fetching metrics by user and date
usageMetricSchema.index({ userId: 1, createdAt: -1 });

const UsageMetric = mongoose.model('UsageMetric', usageMetricSchema);

export default UsageMetric;