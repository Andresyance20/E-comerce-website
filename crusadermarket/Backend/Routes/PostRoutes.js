//all routes used for creating posts

const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const upload = require('../Middleware/upload');
const verifyToken = require('../Middleware/veryfyToken');

// Route to create a new post, upload pictures in the uploads folder, evetually we will want to be in a clould, stores the url in database 
router.post('/', verifyToken, upload, postController.createPost);

// Route to get all posts
router.get('/', postController.getAllPosts);

// Route to get posts by the logged-in user
router.get('/user/posts', verifyToken, postController.getPostsByUser);

// Express interest in a post
router.post('/interest/:postId', verifyToken, postController.expressInterest);

// Get posts that the user wants to buy
router.get('/user/interests', verifyToken, postController.getInterestedPosts);

// Route to delete a specific post by id
router.delete('/:postId', postController.deletePostById);


module.exports = router;
