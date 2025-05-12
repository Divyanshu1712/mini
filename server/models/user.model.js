// models/user.model.js

const { MongoClient, ObjectId } = require('mongodb');

const userSchema = {
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  posts: [ObjectId] // Array of Post's ObjectId
};

async function createUser(db, userData) {
  const usersCollection = db.collection("users");
  const result = await usersCollection.insertOne(userData);
  return result;
}

async function getUser(db, userId) {
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ _id: ObjectId(userId) });
  return user;
}

module.exports = { userSchema, createUser, getUser };
