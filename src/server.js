const { userModel, teamModel, applyModel } = require("./db");

const Koa = require("koa");
const router = require("koa-router")();
const Cors = require("koa-cors");
const bodyParser = require("koa-bodyparser");

const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const jwt = require("jsonwebtoken");
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
        { expiresIn: '168h' }
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
    ctx.cookies.set("userAccount", body.userAccount);
    ctx.cookies.set("authCode", authCode);

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
    const plays = await teamModel.aggregate([{ $sample: { size: 10 } }]);
    ctx.body = plays;
  })
  .get("/team/play", async (ctx, next) => {
    const plays = await teamModel.aggregate([
      { $match: { sort: "约玩" } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = plays;
  })
  .get("/team/make-team", async (ctx, next) => {
    const teams = await teamModel.aggregate([
      { $match: { sort: "组队" } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = teams;
  })
  .get("/team/share-bill", async (ctx, next) => {
    const shares = await teamModel.aggregate([
      { $match: { sort: "拼单" } },
      { $sample: { size: 10 } },
    ]);
    ctx.body = shares;
  })
  .get("/team/my", async (ctx, next) => {})
  .post("/team/add", async (ctx, next) => {
    let body = ctx.request.body;
    const team = await teamModel.create({
      need: body.need,
      tag: body.tag,
      perNum: body.perNum,
      date: body.date,
      sort: body.sort,
      group: body.group,
    });
    ctx.body = {
      status: 200,
      msg: "The team requirement was successfully published!",
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
    };
  })
  // 提交申请
  .post("/team/apply", async (ctx, next) => {
    // 通信怎么办?
    let body = ctx.request.body;
    const apply = await applyModel.create({
      content: body.content,
      qqNum: body.qqNum,
    });
    ctx.body = {
      status: 200,
      msg: "The application has been successfully submitted!",
    };
  })
  // 社区模块

  // 个人中心模块
  .get("/profile", async (ctx, next) => {
    const raw = String(ctx.header.authorization).split(" ").pop(); // fix bug
    const { id } = jwt.verify(raw, SECRET);
    const user = await userModel.findById(id);
    ctx.body = { user };
  });

app.listen(3000, () => {
  console.log("Server is running at 127.0.0.1:3000");
});
