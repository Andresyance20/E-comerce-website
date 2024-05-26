//backend controller needed for creating posts

const Post = require('../models/PostModel')

//method for creating a post
exports.createPost = async (req, res) => {
  
  const userID = req.user?.userId; // Extract the user ID from the decoded JWT
  
  const { title, price, category, state, payment } = req.body;
  //const userId = req.user.id; // need some sort authetication id in order to make a post for specific user 
  let mediaPaths = [];
  if (req.files) {
    mediaPaths = req.files.map(file => file.path); // Convert files to paths
  }
  
  try {
    //new post with given attributes
    const newPost = new Post({
      title,
      price,
      category,
      state,
      payment: Array.isArray(payment) ? payment : [payment],
      media: mediaPaths,
      user: userID 
  
    });

    await newPost.save();

    // Sending a success response back to the client
    res.status(201).json({ 
      message: 'Post created successfully',
      post: newPost 
    });
  } catch (error) {
    // Sending an error response back to the client
    res.status(400).json({ 
      message: 'Failed to create the post',
      error: error.message 
    });
  }
};

//gets all the posts
exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

  
  //deletes a post by deleting it by its ID
exports.deletePostById = async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.postId);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

  //gets a post based on the User who posted it
exports.getPostsByUser = async (req, res) => {
    const userId = req.user.userId; // Extract the user ID from JWT
    try {
        const userPosts = await Post.find({ user: userId })
            .populate({
                path: 'interestedBuyers',
                select: 'name email phone'  
            });

        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//method for expressing interest in a post, adds it to your orders
exports.expressInterest = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
      const post = await Post.findByIdAndUpdate(
          postId,
          { $addToSet: { interestedBuyers: userId } }, // Ensures no duplicates
          { new: true }
      ).populate('interestedBuyers', 'name email'); // Optional: Adjust based on what buyer info you want to return

      
      res.status(200).json({ message: 'Interest expressed successfully', post });
  } catch (error) {
      console.error('Error expressing interest:', error);
      res.status(500).json({ message: 'Failed to express interest' });
  }
};

//gets the posts that you're interested in
exports.getInterestedPosts = async (req, res) => {
  const userId = req.user.userId;

  try {
      const posts = await Post.find({ interestedBuyers: userId })
          .populate('user', 'name email phone'); // Optional: Adjust based on what seller info you want to show

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error retrieving interested posts:', error);
      res.status(500).json({ message: 'Failed to retrieve interested posts' });
  }
};
