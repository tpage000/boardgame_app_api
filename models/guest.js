const mongoose = require('mongoose');

const guestSchema = mongoose.Schema({
  username: { type: String, required: true },
  avatar: { type: String, default: '/assets/avatars/default.png' },
  kind: { type: String, default: 'Guest' },
  host_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
