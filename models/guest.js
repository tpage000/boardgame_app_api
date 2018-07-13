const mongoose = require('mongoose');

const guestSchema = mongoose.Schema({
  username: { type: String, required: true },
  avatar: { type: String, default: 'http://www.tea-after-twelve.com/uploads/pics/default-avatar.jpg' },
  kind: { type: String, default: 'Guest' },
  host_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
