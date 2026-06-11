const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  startDate: {
    type: String,
    default: '2026-06-09'
  },
  tasks: {
    type: Map,
    of: Boolean,
    default: {}
  },
  dailyLogs: {
    type: Map,
    of: {
      learned: { type: Boolean, default: false },
      coded: { type: Boolean, default: false },
      dsa: { type: Boolean, default: false },
      commit: { type: Boolean, default: false },
      review: { type: Boolean, default: false },
      notes: { type: String, default: '' }
    },
    default: {}
  },
  dsaProblems: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
      phase: { type: String, required: true },
      topic: { type: String, required: true },
      date: { type: String, required: true }
    }
  ],
  milestones: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);
