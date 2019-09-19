# 客服系统

## koa2 vue

###  本系统是一年前帮朋友弄的系统，后面因为一些原因，就没有再弄了，以后有空会继续更新！


#### 游客入口 http://localhost:3005/#/chat
#### 客服入口 http://localhost:3005/#/loginServer 登录后有个会话的入口
#### 客服账号 client1 client2 client3 密码 123
#### 管理员账号 admin 密码 123
#### 游客账号请自行注册就行

### 数据库
```
cd server/db
```

```
mongod --dbpath=./ --port=27018
```

### 服务器

```
cd server
```

```
npm install
```


```
node app or nodemon app.js
```

### 客户端
```
cd client
```

```
npm run build
```

