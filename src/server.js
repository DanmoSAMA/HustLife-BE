const {
  userModel,
  teamModel,
  applyModel,
  postModel,
  commentModel,
} = require("./model");

const path = require("path");
const Koa = require("koa");
const router = require("koa-router")();
const Cors = require("koa-cors");
const bodyParser = require("koa-bodyparser");

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
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
  // 添加组队需求
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
      const posts = await postModel.aggregate([{ $sample: { size: 10 } }]);
      ctx.body = {
        status: 200,
        msg: "Get posts successfully!",
        posts,
      };
    } else {
      const posts = await postModel.aggregate([
        { $match: { tag: ctx.query.tag } },
        { $sample: { size: 10 } },
      ]);
      ctx.body = {
        status: 200,
        msg: `Get ${ctx.query.tag} successfully!`,
        posts,
      };
    }
  })
  // 发帖
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
  // 内容详情页面
  .get("/community/comment", async (ctx, next) => {
    // 将评论的_id加在查询参数中
    const post = await postModel.findOne({
      _id: ctx.query._id,
    });
    const comments = await commentModel.find({
      postId: ctx.query._id,
    });
    ctx.body = {
      status: 200,
      msg: "Get the post details!",
      post,
      comments,
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
    ctx.body = {
      status: 200,
      msg: "Comment successfully!",
      comment,
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
    ctx.body = {
      status: 200,
      user,
    };
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
      user
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
    const posts = postModel.find({
      tokenId: raw
    });
    ctx.body = {
      status: 200,
      msg: "Get my posts successfully!",
      posts
    }
  })
  // 我的收藏

  // 退出登录
  // 告知前端删除localStorage中的token

  // 关注

  // 粉丝
app.listen(3000, () => {
  console.log("Server is running at 127.0.0.1:3000");
});
