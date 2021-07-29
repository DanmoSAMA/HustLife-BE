const {
  userModel,
  teamModel,
  applyModel,
  postModel,
  commentModel,
  collectModel,
  subcommentModel,
  followModel,
  searchModel,
} = require("./model");

// const path = require("path");
const Koa = require("koa");
const router = require("koa-router")();
const Cors = require("koa-cors");
const bodyParser = require("koa-bodyparser");

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const jwt = require("jsonwebtoken");
// const formidable = require("formidable");
const app = new Koa();

const SECRET = "qfuhsnbvkjahowjrhfn";

app.use(Cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

router
  //用户模块
  // 登录
  .post("/users/login", async (ctx, next) => {
    let body = ctx.request.body;
    const user = await userModel.findOne({ userAccount: body.userAccount });
    if (!user) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Not find this user!",
      };
      return;
    }

    const isPasswordValid = require("bcrypt").compareSync(
      body.password,
      user.password
    );
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          id: String(user._id),
        },
        SECRET,
        { expiresIn: "168h" }
      );
      ctx.body = {
        status: 200,
        msg: "Log in successfully!",
        user,
        token,
        // 前端将token存在localstorage中
        // 注销时，前端删除localstorage中的token
      };
    } else {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Password is incorrect!",
      };
    }
  })
  // 注册-s1
  .post("/users/register", async (ctx, next) => {
    let body = ctx.request.body;
    let authCode = Math.random().toString().slice(-6);
    ctx.cookies.set("userAccount", body.userAccount, {
      maxAge: 5 * 60 * 1000,
    });
    ctx.cookies.set("authCode", authCode, {
      maxAge: 5 * 60 * 1000,
    });

    const user = await userModel.findOne({ userAccount: body.userAccount });

    if (user) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "This user has already registered!",
      };
      return;
    } else {
      // 发送邮件
      const transport = nodemailer.createTransport(
        smtpTransport({
          host: "smtp.qq.com",
          port: 465,
          secureConnection: true,
          auth: {
            user: "772523546@qq.com",
            pass: "qnqrfuansxuwbbge",
          },
        })
      );
      const mailOptions = {
        from: '"Hust Life" <772523546@qq.com>',
        to: `${body.userAccount}@qq.com`,
        subject: "Hust Life 邮箱验证",
        html: `本次注册的验证码为：${authCode}`,
      };

      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + info.response);
        }
      });

      ctx.body = {
        status: 200,
        msg: "Next step, please input the authCode!",
      };
    }
  })
  // 注册-s2
  .post("/users/register/auth", async (ctx, next) => {
    let body = ctx.request.body;
    if (ctx.cookies.get("authCode") === body.authCode) {
      const user = await userModel.create({
        userAccount: ctx.cookies.get("userAccount"),
        password: body.password,
      });
      ctx.body = {
        user,
        status: 200,
        msg: "Register successfully!",
      };
    } else {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "AuthCode is incorrect!",
      };
    }
  })
  // 忘记密码-s1
  .post("/users/forget", async (ctx, next) => {
    let body = ctx.request.body;
    let authCode = Math.random().toString().slice(-6);
    ctx.cookies.set("userAccount", body.userAccount);
    ctx.cookies.set("authCode", authCode);

    const user = await userModel.findOne({ userAccount: body.userAccount });

    if (!user) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Not find this user!",
      };
      return;
    } else {
      // 发送邮件
      const transport = nodemailer.createTransport(
        smtpTransport({
          host: "smtp.qq.com",
          port: 465,
          secureConnection: true,
          auth: {
            user: "772523546@qq.com",
            pass: "qnqrfuansxuwbbge",
          },
        })
      );
      const mailOptions = {
        from: '"Hust Life" <772523546@qq.com>',
        to: `${body.userAccount}@qq.com`,
        subject: "Hust Life 邮箱验证",
        html: `本次注册的验证码为：${authCode}`,
      };

      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Message sent: " + info.response);
        }
      });

      ctx.body = {
        status: 200,
        msg: "Next step, please input the authCode!",
      };
    }
  })
  // 忘记密码-s2
  .post("/users/forget/auth", async (ctx, next) => {
    let body = ctx.request.body;
    if (ctx.cookies.get("authCode") === body.authCode) {
      ctx.body = {
        status: 200,
        msg: "Next step, please input the new password!",
      };
    } else {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "AuthCode is incorrect!",
      };
    }
  })
  // 忘记密码-s3
  .post("/users/forget/new", async (ctx, next) => {
    let body = ctx.request.body;
    const user = await userModel.updateOne(
      { userAccount: ctx.cookies.get("userAccount") },
      { $set: { password: body.password } }
    );
    ctx.body = {
      status: 200,
      msg: "The password is changed successfully!",
    };
  })

  // 组队模块
  .get("/team/recommend", async (ctx, next) => {
    const recommends = await teamModel.aggregate([{ $sample: { size: 10 } }]);
    ctx.body = {
      status: 200,
      msg: "Get 'recommends' successfully!",
      recommends,
    };
  })
  .get("/team/play", async (ctx, next) => {
    const plays = await teamModel.aggregate([
      { $match: { sort: "约玩" } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = {
      status: 200,
      msg: "Get 'play' successfully!",
      plays,
    };
  })
  .get("/team/make-team", async (ctx, next) => {
    const teams = await teamModel.aggregate([
      { $match: { sort: "组队" } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = {
      status: 200,
      msg: "Get 'teams' successfully!",
      teams,
    };
  })
  .get("/team/share-bill", async (ctx, next) => {
    const shares = await teamModel.aggregate([
      { $match: { sort: "拼单" } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = {
      status: 200,
      msg: "Get 'shares' successfully!",
      shares,
    };
  })
  .get("/team/my", async (ctx, next) => {
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const my = await teamModel.aggregate([
      { $match: { tokenId: id } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = {
      status: 200,
      msg: "Get 'my' successfully!",
      my,
    };
  })
  // 添加组队需求
  .post("/team/add", async (ctx, next) => {
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const team = await teamModel.create({
      need: body.need,
      tag: body.tag,
      perNum: body.perNum,
      date: body.date,
      sort: body.sort,
      group: body.group,
      tokenId: id,
    });
    ctx.body = {
      status: 200,
      msg: "The team requirement was successfully published!",
      team,
    };
  })
  // 修改组队需求
  .post("/team/modify", async (ctx, next) => {
    let body = ctx.request.body;
    const team = await teamModel.updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          need: body.need,
          tag: body.tag,
          perNum: body.perNum,
          date: body.date,
          sort: body.sort,
          group: body.group,
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "The group requirement is modified successfully!",
      team,
    };
  })
  // 结束需求
  .post("/team/end", async (ctx, next) => {
    let body = ctx.request.body;
    const team = await teamModel.deleteOne({
      _id: body._id,
    });
    ctx.body = {
      status: 200,
      msg: "Delete successfully!",
      team,
    };
  })
  // 提交申请
  .post("/team/apply", async (ctx, next) => {
    // 通信怎么办?
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const apply = await applyModel.create({
      content: body.content,
      qqNum: body.qqNum,
      tokenId: id,
    });
    ctx.body = {
      status: 200,
      msg: "The application has been successfully submitted!",
      apply,
    };
  })

  // 社区模块
  // 社区首页/话题页
  .get("/community", async (ctx, next) => {
    if (!ctx.query.tag) {
      const posts = await postModel.aggregate([
        { $match: { isPublic: true } },
        { $sample: { size: 10 } },
      ]);
      ctx.body = {
        status: 200,
        msg: "Get posts successfully!",
        posts,
      };
    } else {
      const posts = await postModel.aggregate([
        { $match: { tag: ctx.query.tag, isPublic: true } },
        { $sample: { size: 10 } },
      ]);
      ctx.body = {
        status: 200,
        msg: `Get ${ctx.query.tag} successfully!`,
        posts,
      };
    }
  })
  // 发帖(保存而不发出，依然请求该接口，前端行为不一致)
  .post("/community/add", async (ctx, next) => {
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const post = await postModel.create({
      content: body.content,
      tag: body.tag,
      isPublic: body.isPublic,
      tokenId: id,
    });
    ctx.body = {
      status: 200,
      msg: "Post successfully!",
      post,
    };
  })
  // 修改帖子内容
  .post("/community/modify", async (ctx, next) => {
    let body = ctx.request.body;
    const post = await postModel.updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          content: body.content,
          tag: body.tag,
          isPublic: body.isPublic,
          date: body.date,
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "The post is modified successfully!",
      post,
    };
  })
  // 内容详情页面
  .get("/community/comment", async (ctx, next) => {
    // 将帖子的_id加在查询参数中
    const post = await postModel.findOne({
      _id: ctx.query._id,
    });
    const comments = await commentModel.find({
      postId: ctx.query._id,
    });
    const allSubcomments = new Array();
    for (let i = 0; i < comments.length; i++) {
      let subcomments = await subcommentModel.find({
        commentId: comments[i]._id,
      });
      if (subcomments) {
        for (let j = 0; j < subcomments.length; j++) {
          allSubcomments.push(subcomments[j]);
        }
      }
    }
    ctx.body = {
      status: 200,
      msg: "Get the post details!",
      post,
      comments,
      allSubcomments,
    };
  })
  // 发评论
  .post("/community/comment/add", async (ctx, next) => {
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const comment = await commentModel.create({
      user: body.user, // 此处user应当不止是用户名
      content: body.content,
      postId: body.postId,
      date: body.date,
      tokenId: id,
    });
    const post = await postModel.findOne({
      _id: body.postId,
    });
    let commentNum = post.comments + 1;
    await postModel.updateOne(
      {
        _id: body.postId,
      },
      {
        $set: {
          comments: commentNum,
        },
      }
    );

    ctx.body = {
      status: 200,
      msg: "Comment successfully!",
      comment,
    };
  })
  // 发子评论
  .post("/community/subcomment/add", async (ctx, next) => {
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const subcomment = await subcommentModel.create({
      user: body.user,
      content: body.content,
      commentId: body.commentId,
      tokenId: id,
    });
    ctx.body = {
      status: 200,
      msg: "Comment successfully!",
      subcomment,
    };
  })
  // 收藏
  .post("/community/comment/collect", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const collection = await collectModel.create({
      userId: id,
      postId: body.postId,
    });
    ctx.body = {
      status: 200,
      msg: "Add to collection successfully!",
      collection,
    };
  })
  // 取消收藏
  .post("/community/comment/delete-collect", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const collection = await collectModel.deleteOne({
      userId: id,
      postId: body.postId,
    });
    ctx.body = {
      status: 200,
      msg: "Delete collection successfully!",
      collection,
    };
  })
  // 为帖子点赞
  .post("/community/like", async (ctx, next) => {
    let body = ctx.request.body;
    const oldPost = await postModel.findById(body._id);
    let newLike = oldPost.like + 1;
    const post = await postModel.updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          like: newLike,
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "Thumb up successfully!",
      post,
    };
  })
  // 取消点赞
  .post("/community/delete-like", async (ctx, next) => {
    let body = ctx.request.body;
    const oldPost = await postModel.findById(body._id);
    let newLike = oldPost.like - 1;
    const post = await postModel.updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          like: newLike,
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "Cancel thumb up successfully!",
      post,
    };
  })
  // 为评论点赞
  .post("/community/comment/like", async (ctx, next) => {
    let body = ctx.request.body;
    const oldComment = await commentModel.findById(body._id);
    let newLike = oldComment.like + 1;
    const comment = await commentModel.updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          like: newLike,
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "Thumb up successfully!",
      comment,
    };
  })
  // 取消点赞
  .post("/community/comment/delete-like", async (ctx, next) => {
    let body = ctx.request.body;
    const oldComment = await commentModel.findById(body._id);
    let newLike = oldComment.like - 1;
    const comment = await postModel.updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          like: newLike,
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "Cancel thumb up successfully!",
      comment,
    };
  })
  // 关注他人
  .post("/community/follow", async (ctx, next) => {
    let body = ctx.request.body;
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const follow = await followModel.create({
      followedId: body._id,
      fanId: id,
    });
    ctx.body = {
      status: 200,
      msg: "Follow successfully!",
      follow,
    };
  })

  // 个人中心模块
  // 个人主页(编辑资料页面也请求该API)
  .get("/profile", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const user = await userModel.findById(id);
    if (user) {
      ctx.body = {
        status: 200,
        user,
      };
    } else {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Fail to get user information!",
      };
    }
  })
  // 编辑资料
  .post("/profile/edit", async (ctx, next) => {
    let body = ctx.request.body;
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    // const form = formidable({ multiples: true, uploadDir: "../upload/avatar" });
    // form.parse(ctx.request);  //bug?

    const user = await userModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          userName: body.userName,
          gender: body.gender,
          qqNum: body.qqNum,
          signature: body.signature,
          // avatar:
        },
      }
    );
    ctx.body = {
      status: 200,
      msg: "Personal information has been updated!",
      user,
    };
  })
  // 我发布的
  .get("/profile/myPost", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const posts = await postModel.find({
      tokenId: id,
    });
    ctx.body = {
      status: 200,
      msg: "Get my posts successfully!",
      posts,
    };
  })
  // 我的收藏
  .get("/profile/myCollection", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const postIds = await collectModel.find({
      userId: id,
    });
    let posts = new Array();
    for (let i = 0; i < postIds.length; i++) {
      let post = await postModel.findOne({
        _id: postIds[i].postId,
      });
      posts.push(post);
    }
    // await Promise.all(
    //   posts = postIds.map(async (item) => {
    //     item = await postModel.findOne({
    //       _id: item.postId,
    //     });
    //   })
    // );
    ctx.body = {
      status: 200,
      msg: "Get my collections successfully!",
      posts,
    };
  })
  // 账号设置
  .post("/profile/settings", async (ctx, next) => {
    let body = ctx.request.body;
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const user = await userModel.updateOne(
      {
        _id: id,
      },
      {
        password: body.password,
        qqNum: body.qqNum,
        phoneNum: body.phoneNum,
      }
    );
    ctx.body = {
      status: 200,
      msg: "Settings have been updated successfully!",
      user,
    };
  })
  // 关注页面
  .get("/profile/focus", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const followedId = await followModel.find({
      fanId: id,
    });
    const followeds = new Array();
    for (let i = 0; i < followedId.length; i++) {
      let followed = await userModel.findOne({
        _id: followeds[i].followedId,
      });
      followeds.push(followed);
    }
    ctx.body = {
      status: 200,
      msg: "Get followeds successfully!",
      followeds,
    };
  })
  // 粉丝页面
  .get("/profile/fans", async (ctx, next) => {
    if (!ctx.header || !ctx.header.authorization) {
      ctx.response.status = 422;
      ctx.body = {
        status: 422,
        msg: "Protected resource, use Authorization header to get access!",
      };
      return;
    }
    const raw = String(ctx.header.authorization).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    const fanIds = await followModel.find({
      followedId: id,
    });
    const fans = new Array();
    for (let i = 0; i < fanIds.length; i++) {
      let fan = await userModel.findOne({
        _id: fanIds[i].fanId,
      });
      fans.push(fan);
    }
    ctx.body = {
      status: 200,
      msg: "Get fans successfully!",
      fans,
    };
  })

  // 搜索模块
  // 搜索页面(待完善)
  .get("/search", async (ctx, next) => {
    ctx.body = {
      status: 200,
      msg: "Get search successfully!",
      keyword: "王者荣耀",
      hots: ["内卷", "躺平", "王者荣耀", "英雄联盟"],
    };
  })
  // 搜索
  .get("/search/detail", async (ctx, next) => {
    // 把请求的内容加在url后边：内容类型（全部/组玩/帖子/用户）、关键词
    if (ctx.query.type === "all") {
      const all = await teamModel.find({
        tag: ctx.query.tag,
      });
      ctx.body = {
        status: 200,
        msg: "Get all successfully!",
        all,
      };
    } else if (ctx.query.type === "play") {
      const plays = await teamModel.find({
        sort: "约玩",
        tag: ctx.query.tag,
      });
      ctx.body = {
        status: 200,
        msg: "Get plays successfully!",
        plays,
      };
    } else if (ctx.query.type === "post") {
      const posts = await postModel.find({
        tag: ctx.query.tag,
      });
      ctx.body = {
        status: 200,
        msg: "Get posts successfully!",
        posts,
      };
    } else if (ctx.query.type === "user") {
      const users = await teamModel.find({
        userName: ctx.query.tag,
      });
      ctx.body = {
        status: 200,
        msg: "Get users successfully!",
        users,
      };
    }
  });
  // 话题模块

app.listen(3000, () => {
  console.log("Server is running at 127.0.0.1:3000");
});
