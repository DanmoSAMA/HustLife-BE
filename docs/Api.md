# 接口文档

> PS：有不理解的地方请及时提问

## 用户模块

### 1.登录

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 2.注册

**请求URL：**

```
/users/register
```

**请求方式：**

```
Post
```

**参数说明：**

|   参数   | 是否必选 |  类型  |  说明  |
| :------: | :------: | :----: | :----: |
| userAccount |    是    | string | qq号 |

**返回实例**

```js
{
   "status": 422,
   "msg": "This user has already registered!",
}
   
{
   "status": 200,
   "msg": "Next step, please input the authCode!",
}
```

### 3.邮箱验证

**请求URL：**

```
/users/register/auth
```

**请求方式：**

```
Post
```

**参数说明：**

| 参数 | 是否必选 | 类型 | 说明 |
| ---- | -------- | ---- | ---- |
| authCode |    是    | string | 验证码 |
| password |    是    | string |  密码  |

**返回示例：**

```js
{
  "status": 200,
  "msg": 'Register successfully!'
}

{
   "status": 422,
   "msg": "AuthCode is incorrect!",
}
```

### 4.忘记密码

**请求URL：**

```
/users/forget
```

**请求方式：**

```
Post
```

**参数说明：**

| 参数        | 是否必选 | 类型   | 说明 |
| ----------- | -------- | ------ | ---- |
| userAccount | 是       | string | qq号 |

**返回示例：**

```js
{
   "status": 422,
   "msg": "Not find this user!",
}
   
{
   "status": 200,
   "msg": "Next step, please input the authCode!",
}
```

### 5.忘记密码-输入验证码
**请求URL：**

```
/users/forget/auth
```

**请求方式：**

```
Post
```

**参数说明：**

| 参数     | 是否必选 | 类型   | 说明   |
| -------- | -------- | ------ | ------ |
| authCode | 是       | string | 验证码 |

**返回示例：**

```js
{
   "status": 422,
   "msg": "AuthCode is incorrect!",
}
   
{
   "status": 200,
   "msg": "Next step, please input the new password!",
}
```


### 6.忘记密码-输入新密码

**请求URL：**

```
/users/forget/new
```

**请求方式：**

```
Post
```

**参数说明：**

| 参数     | 是否必选 | 类型   | 说明 |
| -------- | -------- | ------ | ---- |
| password | 是       | string | 密码 |

**返回示例：**

```js
{
   "status": 200,
   "msg": "The password is changed successfully!",
}
```

## 组队模块

### 1.获取页面信息
**请求URL：**

```
/team/recommend（或play/make-team/share-bill）
```

**请求方式：**

```
Get
```


**返回示例：**

```js
{
  "status": 200,
  "msg": "Get 'recommends' successfully!",
  "recommends": [
    {
      "_id": "6100c5f475d5e4bd55e9210d",
      "need": "做社会实践！",
      "tag": "鬼屋",
      "perNum": "6/10",
      "date": "2021-07-28",
      "sort": "组队",
      "group": "772523546",
      "tokenId": "6100b4451100284f7914e390",
      "__v": 0
    },
    {
      "_id": "6100c67e75d5e4bd55e9211c",
      "need": "吃吃喝喝！",
      "tag": "吃",
      "perNum": "6/10",
      "date": "2021-07-28",
      "sort": "约饭",
      "group": "772523546",
      "tokenId": "6100c566d5af88b911100dbb",
      "__v": 0
    },
  ]
}
```

### 2.获取我的信息

**请求URL：**

```
/team/my
```

**请求方式：**

```
Get
```

**请求头信息**

请求头中附带token，如：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDBjNTY2ZDVhZjg4YjkxMTEwMGRiYiIsImlhdCI6MTYyNzQ0MDk3NiwiZXhwIjoxNjI4MDQ1Nzc2fQ.Oyaf5vJ_aUuS8YAN3QxiuMbHXw06QGFa7IY8DboLMEc
```

**返回示例：**

同上

### 3.发起组队需求

**请求URL：**

```
/team/add
```

**请求方式：**

```
Post
```

**请求头信息**

请求头中附带token

**参数说明：**

|  参数  | 是否必选 |  类型  |          说明          |
| :----: | :------: | :----: | :--------------------: |
|  need  |    是    | string |        组队需求        |
|  tag   |    是    | string |      话题/关键词       |
| perNum |    是    | String |          人数          |
|  date  |    是    | string |          日期          |
|  sort  |    是    | string | 类型（组队/约玩/拼单） |
| group  |    是    | string |      qq号/qq群号       |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "The team requirement was successfully published!",
  "team": {
    "_id": "6102ab19258bc6de89b99f42",
    "need": "吃吃喝喝！",
    "tag": "吃",
    "perNum": "6/10",
    "date": "2021-07-28",
    "sort": "约饭",
    "group": "772523546",
    "tokenId": "6100c566d5af88b911100dbb",
    "__v": 0
  }
}
```

### 4.修改组队需求

**请求URL：**

```
/team/modify
```

**请求方式：**

```
Post
```
**请求头信息**

请求头中附带token

**参数说明：**
|  参数  | 是否必选 |  类型  |          说明          |
| :----: | :------: | :----: | :--------------------: |
|  need  |    是    | string |        组队需求        |
|  tag   |    是    | string |      话题/关键词       |
| perNum |    是    | String |          人数          |
|  date  |    是    | string |          日期          |
|  sort  |    是    | string | 类型（组队/约玩/拼单） |
| group  |    是    | string |      qq号/qq群号       |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "The group requirement is modified successfully!",
  "team": {
    "n": 0,
    "nModified": 0,
    "ok": 1
  }
}
```

### 5.结束组队需求

**请求URL：**

```
/team/end
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| _id |    是    | string | 组队的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Delete successfully!",
  "team": {
    "n": 1,
    "ok": 1,
    "deletedCount": 1
  }
}
```

### 6.提交申请（未完善）

**请求URL：**

```
/team/apply
```

**请求方式：**

```
Post
```

**参数说明：**

|  参数   | 是否必选 |  类型  |   说明   |
| :-----: | :------: | :----: | :------: |
| content |    是    | string | 申请内容 |
|  qqNum  |    是    | string |   qq号   |

**返回示例：**

```javascript

```

## 社区模块

### 1.获取首页/话题页

**请求URL：**

```
/community
```

**请求方式：**

```
Get
```

**参数说明：**

| 参数 | 是否必选 |  类型  | 说明 |
| :--: | :------: | :----: | :--: |
| tag  |    否    | string | 话题 |

**返回示例：**

```javascript
// 不加tag，即社区首页，如果超过10条，则随机取10条数据：
{
  "status": 200,
  "msg": "Get posts successfully!",
  "posts": [
    {
      "_id": "6102104aa75125dd84c69d28",
      "like": 0,
      "comments": 0,
      "retweet": 0,
      "content": "火影忍者真好看",
      "tag": "Naruto",
      "isPublic": true,
      "tokenId": "6101637963ef17f0956a145b",
      "__v": 0
    },
    {
      "_id": "6100fedd67124a4a9dd9f1c1",
      "like": 0,
      "comments": 0,
      "retweet": 0,
      "content": "逆转裁判真好玩",
      "tag": "逆转裁判",
      "isPublic": false,
      "tokenId": "6100c566d5af88b911100dbb",
      "__v": 0
    },
    {
      "_id": "61021049a75125dd84c69d24",
      "like": 3,
      "comments": 0,
      "retweet": 0,
      "content": "火影忍者不好看",
      "tag": "Naruto",
      "isPublic": true,
      "tokenId": "6101637963ef17f0956a145b",
      "__v": 0,
      "date": null
    }
  ]
}

// 加tag，会作一次筛选
// 此时tag=逆转裁判
  "status": 200,
  "msg": "Get 逆转裁判 successfully!",
  "posts": [
    {
      "_id": "6100fedd67124a4a9dd9f1bf",
      "like": 0,
      "comments": 0,
      "retweet": 0,
      "content": "逆转裁判真好玩",
      "tag": "逆转裁判",
      "isPublic": false,
      "tokenId": "6100c566d5af88b911100dbb",
      "__v": 0
    }
  ]
}
```

### 2.发帖

保存而不发出也请求该接口，但前端行为不同

**请求URL：**

```
/community/add
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数   | 是否必选 |  类型  |   说明   |
| :------: | :------: | :----: | :------: |
| content  |    是    | string | 发帖内容 |
|   tag    |    是    | string |   话题   |
| isPublic |    是    | string | 是否公开 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Post successfully!",
  "post": {
    "like": 0,		// 点赞数
    "comments": 0,	// 评论数
    "retweet": 0,	// 转发数
    "_id": "6102af67258bc6de89b99f4f",
    "content": "火影忍者真好看",
    "tag": "Naruto",
    "isPublic": true,
    "tokenId": "6101637963ef17f0956a145b",
    "__v": 0
  }
}
```

### 3.修改帖子内容

**请求URL：**

```
/community/comment
```

**请求方式：**

```
Post
```

**参数说明：**

同上，附带token

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "The post is modified successfully!",
  "post": {
    "n": 1,
    "nModified": 0,
    "ok": 1
  }
}
```

### 4.获取内容详情页面

**请求URL：**

```
/community/comment
```

**请求方式：**

```
Get
```

**参数说明：**

| 参数 | 是否必选 |  类型  |   说明    |
| :--: | :------: | :----: | :-------: |
| _id  |    是    | string | 帖子的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Get the post details!",
  "post": { // 帖子信息
    "like": 0,
    "comments": 0,
    "retweet": 0,
    "_id": "6100fedc67124a4a9dd9f1bb",
    "content": "逆转裁判真好玩",
    "tag": "逆转裁判",
    "isPublic": false,
    "tokenId": "6100c566d5af88b911100dbb",
    "__v": 0
  },
  "comments": [	// 该帖子下的评论
    {
      "like": 0,
      "_id": "61026531a6168e07ced16126",
      "user": "Danmoits",
      "content": "很赞同",
      "postId": "6100fedc67124a4a9dd9f1bb",
      "date": "2021-7-28",
      "tokenId": "6100b4451100284f7914e390",
      "__v": 0
    },
    {
      "like": 2,
      "_id": "61026535a6168e07ced16128",
      "user": "Danmoits",
      "content": "很赞同",
      "postId": "6100fedc67124a4a9dd9f1bb",
      "date": "2021-7-28",
      "tokenId": "6100b4451100284f7914e390",
      "__v": 0
    },
    {
      "like": 0,
      "_id": "61026535a6168e07ced1612a",
      "user": "Danmoits",
      "content": "很赞同",
      "postId": "6100fedc67124a4a9dd9f1bb",
      "date": "2021-7-28",
      "tokenId": "6100b4451100284f7914e390",
      "__v": 0
    },
    {
      "like": 0,
      "_id": "61026536a6168e07ced1612c",
      "user": "Danmoits",
      "content": "很赞同",
      "postId": "6100fedc67124a4a9dd9f1bb",
      "date": "2021-7-28",
      "tokenId": "6100b4451100284f7914e390",
      "__v": 0
    }
  ],
  "allSubcomments": [	// 楼中楼
    {
      "_id": "61028d5a2bee5fc0e1406c9b",
      "user": "Danmoits",
      "content": "妙蛙！",
      "commentId": "61026535a6168e07ced1612a",
      "tokenId": "6101637963ef17f0956a145b",
      "__v": 0
    },
    {
      "_id": "61028d642bee5fc0e1406c9d",
      "user": "Danmoits",
      "content": "妙蛙！",
      "commentId": "61026535a6168e07ced1612a",
      "tokenId": "6101637963ef17f0956a145b",
      "__v": 0
    },
    {
      "_id": "61028d652bee5fc0e1406c9f",
      "user": "Danmoits",
      "content": "妙蛙！",
      "commentId": "61026535a6168e07ced1612a",
      "tokenId": "6101637963ef17f0956a145b",
      "__v": 0
    }
  ]
}
```

### 5.发评论

**请求URL：**

```
/community/comment/add
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|  参数   | 是否必选 |  类型  |        说明         |
| :-----: | :------: | :----: | :-----------------: |
|  user   |    是    | string |       用户名        |
| content |    是    | string |      评论内容       |
| postId  |    是    | string | 该评论归属帖子的_id |
|  date   |    是    | string |        日期         |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Comment successfully!",
  "comment": {
    "like": 0,
    "_id": "6102b81523015d7e69bef671",
    "user": "Danmoits",
    "content": "很赞同",
    "postId": "6100fedc67124a4a9dd9f1bb",
    "date": "2021-7-28",
    "tokenId": "6101637963ef17f0956a145b",
    "__v": 0
  }
}
```

### 6.发子评论（楼中楼）

**请求URL：**

```
/community/subcomment/add
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数    | 是否必选 |  类型  |         说明          |
| :-------: | :------: | :----: | :-------------------: |
|   user    |    是    | string |        用户名         |
|  content  |    是    | string |      楼中楼内容       |
| commentId |    是    | string | 该楼中楼归属评论的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Comment successfully!",
  "subcomment": {
    "_id": "6102b89c23015d7e69bef675",
    "user": "Danmoits",
    "content": "妙蛙！",
    "commentId": "61026535a6168e07ced1612a",
    "tokenId": "6101637963ef17f0956a145b",
    "__v": 0
  }
}
```

### 7.收藏

**请求URL：**

```
/community/comment/collect
```

**请求方式：**

```
Post
```

**请求头**

请附带token

**参数说明：**

|  参数  | 是否必选 |  类型  |   说明    |
| :----: | :------: | :----: | :-------: |
| postId |    是    | string | 帖子的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Add to collection successfully!",
  "collection": {
    "_id": "6102b8f623015d7e69bef677",
    "userId": "6101637963ef17f0956a145b",
    "postId": "6100fedc67124a4a9dd9f1bb",
    "__v": 0
  }
}
```

### 8.取消收藏

**请求URL：**

```
/community/comment/delete-collect
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数   | 是否必选 |  类型  |   说明    |
| :------: | :------: | :----: | :-------: |
|  postId  |    是    | string | 帖子的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Delete collection successfully!",
  "collection": {
    "n": 1,
    "ok": 1,
    "deletedCount": 1
  }
}
```

### 9.为帖子点赞

**请求URL：**

```
/community/like
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数   | 是否必选 |  类型  |   说明    |
| :------: | :------: | :----: | :-------: |
|  postId  |    是    | string | 帖子的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Thumb up successfully!",
  "post": {
    "n": 1,
    "nModified": 1,
    "ok": 1
  }
}
```

### 10.取消帖子的点赞

**请求URL：**

```
/community/delete-like
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数   | 是否必选 |  类型  |   说明    |
| :------: | :------: | :----: | :-------: |
|  postId  |    是    | string | 帖子的_id |

**返回示例：**

```javascript
// 略
```

### 11. 为评论点赞

**请求URL：**

```
/community/comment/like
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数    | 是否必选 |  类型  |   说明    |
| :-------: | :------: | :----: | :-------: |
| commentId |    是    | string | 评论的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Thumb up successfully!",
  "comment": {
    "n": 1,
    "nModified": 1,
    "ok": 1
  }
}
```

### 12.取消评论的点赞

**请求URL：**

```
/community/like
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数    | 是否必选 |  类型  |   说明    |
| :-------: | :------: | :----: | :-------: |
| commentId |    是    | string | 评论的_id |

**返回示例：**

```javascript
// 略
```

### 13.关注他人

**请求URL：**

```
/community/follow
```

**请求方式：**

```
Post
```

**请求头**

附带token

**参数说明：**

|   参数   | 是否必选 |  类型  |     说明      |
| :------: | :------: | :----: | :-----------: |
|   _id    |    是    | string | 被关注者的_id |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Follow successfully!",
  "follow": {
    "_id": "6102bcac23015d7e69bef67e",
    "followedId": "6101637963ef17f0956a145b",
    "fanId": "61029067fde74f3e85e9704c",
    "__v": 0
  }
}
```



## 个人中心（后边API的文档没写完）

### 1.获得个人主页

**请求URL：**

```
/profile
```

**请求方式：**

```
Get
```

**请求头信息**

请求头中附带token，如：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDBjNTY2ZDVhZjg4YjkxMTEwMGRiYiIsImlhdCI6MTYyNzQ0MDk3NiwiZXhwIjoxNjI4MDQ1Nzc2fQ.Oyaf5vJ_aUuS8YAN3QxiuMbHXw06QGFa7IY8DboLMEc
```

**返回示例：**

```js
{
  "status": 200,
  "user": {
    "focus": 0,
    "fans": 0,
    "_id": "6100b4451100284f7914e390",
    "userAccount": "772523546",
    "password": "$2b$10$Djv.YsD6/miXX6rgCTXfjOTyQVzaSRb3YBIMvqtFZCam4uWNzbOTS",
    "__v": 0
  }
}
```

### 2.编辑资料

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 3.我发布的

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 4.我收藏的

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 5.账号设置

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 6.获取关注页面

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 7.获取粉丝页面

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```



## 搜索模块

### 1.搜索界面

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```

### 2.搜索

**请求URL：**

```
/users/login
```

**请求方式：**

```
Post
```

**参数说明：**

|    参数     | 是否必选 |  类型  | 说明 |
| :---------: | :------: | :----: | :--: |
| userAccount |    是    | string | qq号 |
|  password   |    是    | string | 密码 |

**返回示例：**

```javascript
{
  "status": 200,
  "msg": "Log in successfully!"
}

{
  "status": 422,
  "msg": "Not find this user!",
}
  
{
  "status": 422,
  "msg": "Password is incorrect!",
}
```
