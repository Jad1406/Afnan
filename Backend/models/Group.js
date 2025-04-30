const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
    },
    mediaPosts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GalleryPost',
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Posts', // Changed to reference 'Posts'
    },
}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;