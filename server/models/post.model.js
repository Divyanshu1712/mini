// models/post.model.js

const { MongoClient, ObjectId } = require('mongodb');

const blogSchema = {
  title: String,
  content: String,
  author: ObjectId, // Reference to a User's ObjectId
  likes: [ObjectId], // Array of User's ObjectIds
  date: { type: Date, default: Date.now }
};

async function createPost(db, postData) {
  const postsCollection = db.collection("posts");
  const result = await postsCollection.insertOne(postData);
  return result;
}

async function getPost(db, postId) {
  const postsCollection = db.collection("posts");
  const post = await postsCollection.findOne({ _id: ObjectId(postId) });
  return post;
}

module.exports = { blogSchema, createPost, getPost };
