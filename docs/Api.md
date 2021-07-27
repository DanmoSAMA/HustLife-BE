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

