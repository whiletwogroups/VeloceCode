const Progress = require('../models/Progress');

// @desc    Get user progress state
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id });

    // Fallback if progress document doesn't exist for some reason
    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        startDate: '2026-06-09',
        tasks: {},
        dailyLogs: {},
        dsaProblems: [],
        milestones: {}
      });
    }

    res.json({
      startDate: progress.startDate,
      tasks: progress.tasks || {},
      dailyLogs: progress.dailyLogs || {},
      dsaProblems: progress.dsaProblems || [],
      milestones: progress.milestones || {}
    });
  } catch (error) {
    console.error('Get Progress Error:', error);
    res.status(500).json({ message: 'Server error fetching progress' });
  }
};

// @desc    Update user progress state
// @route   PUT /api/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { startDate, tasks, dailyLogs, dsaProblems, milestones } = req.body;

    let progress = await Progress.findOne({ user: req.user._id });

    if (!progress) {
      progress = new Progress({ user: req.user._id });
    }

    if (startDate !== undefined) progress.startDate = startDate;
    if (tasks !== undefined) progress.tasks = tasks;
    if (dailyLogs !== undefined) progress.dailyLogs = dailyLogs;
    if (dsaProblems !== undefined) progress.dsaProblems = dsaProblems;
    if (milestones !== undefined) progress.milestones = milestones;

    await progress.save();

    res.json({
      startDate: progress.startDate,
      tasks: progress.tasks || {},
      dailyLogs: progress.dailyLogs || {},
      dsaProblems: progress.dsaProblems || [],
      milestones: progress.milestones || {}
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    res.status(500).json({ message: 'Server error updating progress' });
  }
};

module.exports = {
  getProgress,
  updateProgress
};
