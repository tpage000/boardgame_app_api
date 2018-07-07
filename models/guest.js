const mongoose = require('mongoose');

const guestSchema = mongoose.Schema({
  username: { type: String, required: true },
  avatar: { type: String, default: 'http://www.tea-after-twelve.com/uploads/pics/default-avatar.jpg' },
  // date: { type: Date },
  // username: { type: String, required: true }
  host_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);