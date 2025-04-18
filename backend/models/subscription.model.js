const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripeSubscriptionId: { type: String, required: true },
  status: { type: String, enum: ['active', 'canceled'], default: 'active' },
  
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);