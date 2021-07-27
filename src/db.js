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
});

// 提交申请
const applySchema = new Schema({
  qqNum: {
    type: String
  },
  content: {
    type: String
  }
})

const userModel = mongoose.model("users", userSchema);
const teamModel = mongoose.model("teams", teamSchema);
const applyModel = mongoose.model("applies", applySchema);

module.exports = { userModel, teamModel, applyModel };
