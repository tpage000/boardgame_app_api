const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.put('/:id', async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedUser); 
  } catch(err) {
    console.log(err);
    res.status(400).send({ message: err.message })
  }
});

module.exports = router;
