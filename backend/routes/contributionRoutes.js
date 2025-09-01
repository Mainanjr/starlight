const express = require('express');
const Contribution = require('../models/Contribution');
const { auth, requireTreasurer } = require('../middleware/auth');

const router = express.Router();

// Get all contributions for the authenticated user
router.get('/my-contributions', auth, async (req, res) => {
  try {
    const contributions = await Contribution.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ contributions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new contribution
router.post('/', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    const contribution = new Contribution({
      userId: req.user._id,
      amount,
      description
    });
    
    await contribution.save();
    
    res.status(201).json({
      message: 'Contribution created successfully',
      contribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all pending contributions (treasurer only)
router.get('/pending', auth, requireTreasurer, async (req, res) => {
  try {
    const contributions = await Contribution.find({ status: 'pending' })
      .populate('userId', 'firstName lastName username email')
      .sort({ createdAt: -1 });
    
    res.json({ contributions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve a contribution (treasurer only)
router.put('/:id/approve', auth, requireTreasurer, async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }
    
    if (contribution.status !== 'pending') {
      return res.status(400).json({ message: 'Contribution is not pending' });
    }
    
    contribution.status = 'approved';
    contribution.approvedBy = req.user._id;
    contribution.approvedAt = new Date();
    
    await contribution.save();
    
    res.json({
      message: 'Contribution approved successfully',
      contribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Decline a contribution (treasurer only)
router.put('/:id/decline', auth, requireTreasurer, async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }
    
    if (contribution.status !== 'pending') {
      return res.status(400).json({ message: 'Contribution is not pending' });
    }
    
    contribution.status = 'declined';
    contribution.approvedBy = req.user._id;
    contribution.approvedAt = new Date();
    
    await contribution.save();
    
    res.json({
      message: 'Contribution declined successfully',
      contribution
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get contribution statistics (treasurer only)
router.get('/stats', auth, requireTreasurer, async (req, res) => {
  try {
    const stats = await Contribution.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
