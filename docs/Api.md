# 接口文档

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

## 社区模块



## 个人中心

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
