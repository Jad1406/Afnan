// controllers/groupController.js

const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Group = require('../models/Group');
const Post = require('../models/Post');
const GalleryPost = require('../models/GalleryPost');

// 1. Create a new group
const createGroup = async (req, res) => {
  const { name, description } = req.body;
  const groupAdmin = req.user._id;

  try {
    const group = await Group.create({ name, description, groupAdmin, members: [groupAdmin] });
    res.status(StatusCodes.CREATED).json(group);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// 2. Join a group
const joinGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });

    if (group.members.includes(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Already a member' });
    }

    group.members.push(userId);
    await group.save();
    res.status(StatusCodes.OK).json(group);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error joining group' });
  }
};

// 3. Leave a group
const leaveGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });

    group.members = group.members.filter(id => id.toString() !== userId.toString());
    await group.save();
    res.status(StatusCodes.OK).json({ msg: 'Left the group' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error leaving group' });
  }
};

// 4. Get all groups
const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('groupAdmin', 'name').select('-__v');
    res.status(StatusCodes.OK).json(groups);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching groups' });
  }
};

// 5. Get group by ID
const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('groupAdmin', 'name')
      .populate('members', 'name')
      .populate('posts')
      .populate('mediaPosts')
      .populate('replies');

    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });
    res.status(StatusCodes.OK).json(group);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching group' });
  }
};

// 6. Create a text post
const createTextPostInGroup = async (req, res) => {
  const { title, content } = req.body;
  const groupId = req.params.id;
  const user = req.user._id;

  try {
    const post = await Post.create({ title, content, user });
    const group = await Group.findById(groupId);
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });

    group.posts = post._id;
    await group.save();
    res.status(StatusCodes.CREATED).json(post);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating text post' });
  }
};

// 7. Create a media post
const createMediaPostInGroup = async (req, res) => {
  const { title, content, mediaUrl, category, tags } = req.body;
  const groupId = req.params.id;
  const user = req.user._id;

  try {
    const mediaPost = await GalleryPost.create({ title, content, user, mediaUrl, category, tags });
    const group = await Group.findById(groupId);
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });

    group.mediaPosts = mediaPost._id;
    await group.save();
    res.status(StatusCodes.CREATED).json(mediaPost);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating media post' });
  }
};

// 8. Reply to a post (group-level reply)
const replyToPostInGroup = async (req, res) => {
  const { title, content } = req.body;
  const groupId = req.params.id;
  const user = req.user._id;

  try {
    const reply = await Post.create({ title, content, user });
    const group = await Group.findById(groupId);
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });

    group.replies.push(reply._id);
    await group.save();
    res.status(StatusCodes.CREATED).json(reply);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error creating reply' });
  }
};

// 9. Get posts in group
const getPostsInGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('posts').populate('mediaPosts');
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });
    res.status(StatusCodes.OK).json({ posts: group.posts, mediaPosts: group.mediaPosts });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching posts' });
  }
};

// 10. Delete group (admin only)
const deleteGroup = async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Group not found' });

    if (group.groupAdmin.toString() !== userId.toString()) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Only group admin can delete the group' });
    }

    await group.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Group deleted successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error deleting group' });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  leaveGroup,
  getAllGroups,
  getGroupById,
  createTextPostInGroup,
  createMediaPostInGroup,
  replyToPostInGroup,
  getPostsInGroup,
  deleteGroup,
};
