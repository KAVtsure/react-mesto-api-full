const express = require('express');
const { updateUserProfileValidate, updateAvatarValidate, getUserByIdValidate } = require('../middlewares/validation');

const userRoutes = express.Router();
const {
  getUser, getUserById, updateUserProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');

userRoutes.get('/', getUser);

userRoutes.patch('/me', updateUserProfileValidate, updateUserProfile);

userRoutes.get('/me', getCurrentUser);

userRoutes.get('/:userId', getUserByIdValidate, getUserById);

userRoutes.patch('/me/avatar', updateAvatarValidate, updateAvatar);

module.exports = { userRoutes };
