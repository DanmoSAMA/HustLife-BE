const { StreamingQuerystring } = require("formidable");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://127.0.0.1/Hust-life", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.once("open", function () {
  console.log("Database is connected successfully!");
});

// 用户模块
const userSchema = new Schema({
  userAccount: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    set(val) {
      return require("bcrypt").hashSync(val, 10);
    },
  },
  userName: {
    type: String,
    default: "新用户",
  },
  gender: {
    type: Boolean,
    default: true,
  },
  qqNum: {
    type: String,
    default: "",
  },
  phoneNum: {
    type: String,
    default: "",
  },
  signature: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "../upload/avatar/default.png",
  },
  focus: {
    type: Number,
    default: 0,
  },
  fans: {
    type: Number,
    default: 0,
  },
});

// 组队模块
const teamSchema = new Schema({
  need: {
    type: String,
  },
  tag: {
    type: String,
  },
  perNum: {
    type: String,
  },
  date: {
    type: String,
  },
  sort: {
    type: String,
  },
  group: {
    type: String,
  },
  tokenId: {
    type: String,
  },
});

// 提交申请
const applySchema = new Schema({
  qqNum: {
    type: String,
  },
  content: {
    type: String,
  },
  tokenId: {
    type: String,
  },
});

// 社区模块
// 发帖
const postSchema = new Schema({
  content: {
    type: String,
  },
  tag: {
    type: String,
  },
  isPublic: {
    type: Boolean,
  },
  date: {
    type: String,
  },
  like: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  retweet: {
    type: Number,
    default: 0,
  },
  tokenId: {
    type: String,
  },
});
// 评论
const commentSchema = new Schema({
  user: {
    type: String,
  },
  content: {
    type: String,
  },
  postId: {
    type: String,
  },
  date: {
    type: String,
  },
  like: {
    type: Number,
    default: 0,
  },
  subcommentNum: {
    type: Number,
  },
  tokenId: {
    type: String,
  },
});
// 子评论
const subcommentSchema = new Schema({
  user: {
    type: String,
  },
  content: {
    type: String,
  },
  commentId: {
    type: String,
  },
  tokenId: {
    type: String,
  },
});
// 收藏
const collectSchema = new Schema({
  userId: {
    type: String,
  },
  postId: {
    type: String,
  },
});
// 关注/粉丝
const followSchema = new Schema({
  followedId: {
    type: String,
  },
  fanId: {
    type: String,
  },
});

// 搜索模块(修改)
const searchSchema = new Schema({
  keyword: {
    type: String,
  },
  hots: [
    {
      type: String,
    },
  ],
});

const userModel = mongoose.model("users", userSchema);
const teamModel = mongoose.model("teams", teamSchema);
const applyModel = mongoose.model("applies", applySchema);
const postModel = mongoose.model("posts", postSchema);
const commentModel = mongoose.model("comments", commentSchema);
const collectModel = mongoose.model("collections", collectSchema);
const subcommentModel = mongoose.model("subcomments", subcommentSchema);
const followModel = mongoose.model("follows", followSchema);
const searchModel = mongoose.model("searchments", searchSchema);

module.exports = {
  userModel,
  teamModel,
  applyModel,
  postModel,
  commentModel,
  collectModel,
  subcommentModel,
  followModel,
  searchModel,
};
