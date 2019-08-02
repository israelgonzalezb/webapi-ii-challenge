const express = require("express");
const Posts = require("../data/db.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find(req.query);
    res.status(200).json(posts);
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The posts information could not be retrieved."
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log(post.length);

    if (post.length) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      error: "The post information could not be retrieved."
    });
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.body.title && req.body.contents) {
      const post = await Posts.insert(req.body);
      res.status(201).json(post);
    } else {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post"
      });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "There was an error while saving the post to the database"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const postId = await Posts.remove(req.params.id);
    if (postId) {
      res.status(200).json({ message: "The post has been deleted" });
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "The post could not be removed"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (req.body.title && req.body.contents) {
      const post = await Posts.update(req.params.id, req.body);
      if (post) {
        const newPost = await Posts.findById(post);
        res.status(200).json(newPost);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    } else {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    }
  } catch (error) {
    // log error to database
    console.log(error);
    res.status(500).json({
      message: "The post information could not be modified"
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Posts.findPostComments(req.params.id);
    if (comments.length) {
      res.status(200).json(comments);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved." });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    
    const comment = req.body;
    
    comment.post_id = req.params.id;
    
    if (!post.length) {
      res.status(404).json({message: "The post with the specified ID does not exist"});
      
    }else if (!comment.text){
      res.status(400).json({message: "Please provide text for the comment."});
    } else {
      const newCommentId = await Posts.insertComment(comment);
      const newComment = await Posts.findCommentById(newCommentId.id);
      res.status(201).json(newComment);
    }
  } catch {
    res.status(500).json({error: "There was an error while saving the comment to the database"});
  }
});

module.exports = router;
