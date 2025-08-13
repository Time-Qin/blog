---
title: "Docker学习记录"
description: "使用ChatGPT5来学习Docker"
pubDate: "2025-8-13"
heroImage: "https://picsum.photos/id/1/512/255.webp"
author: "Ekko"
tags: ["html", "js", "web", "mysql", "docker", "node"]
---

# 使用 ChatGPT5 来学习 Docker 记录

> <a href="https://chatgpt.com/share/689abb4a-46a4-800a-8693-e55512c9212b" target="_blank">地址</a>

好，那我们就进入 **Docker 学习模式**。
我会帮你从零开始，分成几个阶段，让你既能理解原理，也能快速上手。

---

## 学习路线（建议顺序）

1. **基础概念**
   - 什么是 Docker
   - 为什么要用 Docker（相比虚拟机的优势）
   - 基本组成（镜像、容器、仓库）
2. **环境安装**
   - 在 Windows / macOS / Linux 安装 Docker
   - 验证是否安装成功
3. **Docker 核心命令**
   - 镜像相关：`docker pull`、`docker images`、`docker rmi`
   - 容器相关：`docker run`、`docker ps`、`docker stop`、`docker rm`
   - 常用调试：`docker logs`、`docker exec`
4. **Docker 镜像构建**
   - `Dockerfile` 基础语法
   - 从零构建一个镜像并运行
5. **Docker 网络与数据持久化**
   - 容器互联（bridge / host / overlay 网络）
   - 数据卷（volume）使用
6. **综合实战**
   - 部署一个完整的 Web 应用（例如 Nginx + MySQL + 应用）
   - 使用 `docker-compose` 管理多容器项目

---

如果你愿意，我们可以一步一步来，我先帮你讲清 **第 1 步：Docker 基础概念**，并配合可视化比喻，让你完全搞懂它的原理。
要我现在就从这一步开始吗？

好，那我们先从 **Docker 基础概念** 开始。

---

## 基础概念

### 1. Docker 是什么？

用一句话：

> **Docker 是一个轻量级的应用容器引擎，让你可以把应用和它运行所需的一切打包，然后在任何地方快速运行。**

它有点像一个“便携运行环境”，你的应用不用担心“在我电脑上能跑，换你电脑就不行”的尴尬。

---

### 2. 为什么用 Docker？

和 **传统虚拟机** 对比：

| 特性     | 虚拟机          | Docker 容器              |
| -------- | --------------- | ------------------------ |
| 启动速度 | 几分钟          | 几秒甚至毫秒             |
| 资源占用 | 占用一个完整 OS | 共享宿主机内核，更轻量   |
| 体积     | 几 GB           | 几十 MB ~ 百 MB          |
| 迁移     | 比较笨重        | 镜像一拷，随处运行       |
| 隔离性   | 完全隔离        | 进程级隔离（够用且高效） |

**直观比喻**：

- **虚拟机** = 在你的电脑里再装一台完整的电脑
- **Docker** = 在你的电脑里开一个隔离的小房间，里面放好你的应用和运行环境

---

### 3. Docker 三大核心概念

你只要先记住这三样，Docker 就算入门了：

1. **镜像（Image）**
   - 相当于“应用安装包 + 环境快照”
   - 只读，不会变
   - 可以从仓库下载，也可以自己做
2. **容器（Container）**
   - 镜像的运行实例（相当于装好并启动的应用）
   - 可以启动、停止、删除
   - 删除后数据可能会丢（除非用数据卷）
3. **仓库（Registry）**
   - 存放镜像的地方
   - 官方公共仓库：Docker Hub（hub.docker.com）
   - 也可以搭建私有仓库

---

✅ 到这里，你应该对 Docker 是什么、为什么用、核心概念有了直观认识。

我建议我们下一步做 **Docker 安装与环境验证**，这样你马上就能运行第一个容器。
你是打算在 **Windows、macOS 还是 Linux** 上安装？这样我可以直接给你具体安装步骤。

好，我们来在 **Windows** 上安装 Docker。
因为 Windows 版本差别会影响安装方式，我会把流程分成 **Windows 10/11 专业版** 和 **家庭版** 两种情况。

---

## 环境安装

### **1. 检查系统版本**

- 按 **Win + R** → 输入 `winver` → 回车
- 看你的 Windows 是 **专业版 / 家庭版**，还有版本号（最好 21H1 以上）

Docker Desktop 需要：

- **64 位 Windows 10/11**
- 专业版（Pro）可以直接用 Hyper-V
- 家庭版也能装，但会用 WSL2

---

### **2. 安装步骤**

#### **方法一：Windows 10/11 专业版**

1. **开启 Hyper-V**
   - 按 **Win + S** 搜索 “启用或关闭 Windows 功能”
   - 勾选 **Hyper-V** 和 **容器**
   - 重启电脑
2. **下载 Docker Desktop**
   - 去官网：https://www.docker.com/products/docker-desktop
   - 下载 Windows 版本安装包
3. **安装**
   - 双击安装包，一路下一步
   - 勾选 **Use the WSL 2 based engine**（建议开启 WSL2）
   - 完成后启动 Docker Desktop

---

#### **方法二：Windows 10/11 家庭版**

1. **开启 WSL2**

   - 以管理员身份打开 PowerShell，输入：

     ```powershell
     wsl --install
     ```

   - 默认会安装 Ubuntu 子系统（也可以换别的 Linux）

   - 安装完重启

2. **设置 WSL2 为默认版本**

   ```powershell
   wsl --set-default-version 2
   ```

3. **下载 Docker Desktop**

   - 还是去官网下载安装
   - 安装时会检测到你有 WSL2，然后自动适配

---

### **3. 验证安装**

安装完成后：

1. 打开 PowerShell（或 CMD），输入：

   ```powershell
   docker --version
   ```

   如果能输出版本号（比如 `Docker version 27.0.3, build ...`），说明 CLI 安装成功

2. 运行一个测试容器：

   ```powershell
   docker run hello-world
   ```

   如果输出 `Hello from Docker!`，说明 Docker 正常运行

---

我可以帮你做一个 **Windows 安装 Docker 的完整可视化流程图**，这样你对步骤会更直观。
你需要我画出来吗？这样你边看图边做不会出错。

## Docker 核心命令

很好 👍
那你现在的环境已经准备好了，我们可以直接进入 **Docker 核心命令** 的学习和实操阶段。

我建议从这几个最常用的命令开始：

1. **查看版本与运行状态**

   ```powershell
   docker --version
   docker info
   ```

2. **拉取镜像**（从 Docker Hub 下载）

   ```powershell
   docker pull nginx
   ```

3. **查看本地镜像**

   ```powershell
   docker images
   ```

4. **运行容器**（启动一个临时的 nginx 服务）

   ```powershell
   docker run -d -p 8080:80 nginx
   ```

   - `-d` 后台运行
   - `-p` 端口映射（本机 8080 → 容器 80）

5. **查看容器列表**

   ```powershell
   docker ps
   ```

6. **停止和删除容器**

   ```powershell
   docker stop <容器ID>
   docker rm <容器ID>
   ```

---

如果你愿意，我可以帮你做一个 **可视化命令速查表**，方便你边学边用，不用每次都去查文档。
要我帮你画吗？这样你练习的时候可以直接照着用。

好的，那我们就直接进入练习环节。

你现在可以按这个顺序试一下：

1. 拉取一个镜像

   ```powershell
   docker pull nginx
   ```

2. 查看是否拉取成功

   ```powershell
   docker images
   ```

3. 启动一个容器并映射端口

   ```powershell
   docker run -d -p 8080:80 nginx
   ```

4. 打开浏览器访问

   ```
   http://localhost:8080
   ```

   看到 Nginx 欢迎页面就说明容器运行成功。

完成后，我可以带你学 **Docker 镜像构建（Dockerfile）**，让你自己打包属于你的镜像。

## Docker 镜像构建

很好 👍
那我们就进入下一步——**Docker 镜像构建（Dockerfile）**。

---

### 1. 什么是 Dockerfile

- **Dockerfile** 是一个纯文本文件
- 里面写着“如何一步步构建镜像”的指令
- 类似“烹饪食谱”，Docker 会按你写的步骤自动做出镜像

---

### 2. 最简单的例子

我们做一个 **自己的 Nginx 镜像**，首页显示“Hello Docker!”

**在一个空文件夹中**创建文件：
`Dockerfile`

```dockerfile
# 基于官方 Nginx 镜像
FROM nginx:latest

# 把本地 index.html 覆盖到容器的 Nginx 默认目录
COPY index.html /usr/share/nginx/html/index.html
```

再在同目录创建：
`index.html`

```html
<h1>Hello Docker!</h1>
```

---

### 3. 构建镜像

在该文件夹下执行：

```powershell
docker build -t my-nginx .
```

- `-t my-nginx` 给镜像起名字
- `.` 表示当前目录为构建上下文

---

### 4. 运行镜像

```powershell
docker run -d -p 8081:80 my-nginx
```

然后访问：

```
http://localhost:8081
```

就会看到你的自定义首页了 🎉

---

如果你愿意，我可以在下一步直接带你做 **多容器应用（docker-compose）**，这样你可以一次启动一个完整的 Web + 数据库环境。
你想直接进到这个阶段吗？

### **多容器应用 docker-compose 实战**

好，我们把刚才的 **PHP + MySQL** 案例改成 **Node.js + MySQL**，这样你可以用 Docker 一次启动一个 Node 服务和数据库，并实现数据库连接。

---

#### 1. 项目结构

```
myapp/
  docker-compose.yml
  src/
    package.json
    server.js
```

---

#### 2. `package.json`

（定义依赖）

```json
{
  "name": "node-mysql-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0"
  }
}
```

---

#### 3. `server.js`

（简单测试 Node 连接 MySQL）

```javascript
const express = require("express")
const mysql = require("mysql2")

const app = express()
const port = 3000

// 创建数据库连接
const connection = mysql.createConnection({
  host: "db", // docker-compose 中 MySQL 服务名
  user: "root",
  password: "example",
})

app.get("/", (req, res) => {
  connection.connect((err) => {
    if (err) {
      res.send("数据库连接失败: " + err.message)
    } else {
      res.send("数据库连接成功！")
    }
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
```

---

#### 4. `docker-compose.yml`

```yaml
version: "3.8"

services:
  web:
    image: node:18
    container_name: my-node
    working_dir: /app
    volumes:
      - ./src:/app
    ports:
      - "8082:3000"
    command: sh -c "npm install && node server.js"
    depends_on:
      - db

  db:
    image: mysql:8.0
    container_name: my-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

---

#### 5. 启动项目

在 `myapp` 目录下运行：

```powershell
docker-compose up -d
```

---

#### 6. 测试

浏览器访问：

```
http://localhost:8082
```

能看到 `数据库连接成功！` 说明 Node 已经连上 MySQL。

---

我可以帮你把这个案例再升级成 **Node + MySQL + 自动初始化数据表**，这样容器一启动就能建表并插入测试数据。
这样做能让你的服务真正可用，而不是只有连接测试。
你要我直接帮你改成这个版本吗？

好，那我们把 **Node + MySQL** 案例升级成 **启动自动建表并插入测试数据** 的版本，这样你一 `docker-compose up`，环境就能直接跑起来。

---

#### 1. 项目结构

```
myapp/
  docker-compose.yml
  init.sql
  src/
    package.json
    server.js
```

---

#### 2. `init.sql`（MySQL 启动自动执行）

```sql
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');
```

> 这个文件会在 MySQL 第一次启动时自动执行（通过 `/docker-entrypoint-initdb.d/` 机制）。

---

#### 3. `package.json`

```json
{
  "name": "node-mysql-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0"
  }
}
```

---

#### 4. `server.js`（启动时连接数据库并查询数据）

```javascript
const express = require("express")
const mysql = require("mysql2")

const app = express()
const port = 3000

// 创建数据库连接
const connection = mysql.createConnection({
  host: "db", // 服务名，来自 docker-compose
  user: "root",
  password: "example",
  database: "testdb",
})

// 首页：查询 users 表
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send("数据库查询失败: " + err.message)
    } else {
      res.json(results)
    }
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
```

---

#### 5. `docker-compose.yml`

```yaml
version: "3.8"

services:
  web:
    image: node:18
    container_name: my-node
    working_dir: /app
    volumes:
      - ./src:/app
    ports:
      - "8082:3000"
    command: sh -c "npm install && node server.js"
    depends_on:
      - db

  db:
    image: mysql:8.0
    container_name: my-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  db_data:
```

---

#### 6. 启动

```powershell
docker-compose up -d
```

---

#### 7. 测试

访问：

```
http://localhost:8082
```

输出：

```json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" },
  { "id": 3, "name": "Charlie" }
]
```

说明 Node 已经连接 MySQL，并能读到初始化好的数据。

---

如果你愿意，我可以帮你 **加上容器间热更新**，这样你改 Node 代码不用重启容器，保存后就能生效。
这样开发体验会更丝滑。
你要直接做这个优化吗？

## Docker 网络与数据持久化

好，那我们正式进入 **Docker 网络与数据卷** 的深入学习，这两块是容器化运维的核心技能。

---

### 一、Docker 网络深入

Docker 容器之间通信依赖 **网络驱动**，常用的有 3 种：

| 网络类型           | 特点                                                         | 适用场景                                |
| ------------------ | ------------------------------------------------------------ | --------------------------------------- |
| **bridge**（默认） | 在宿主机上创建虚拟网桥，容器通过虚拟网卡连接，支持容器名互访 | 单机多容器应用（`docker run` 默认使用） |
| **host**           | 容器直接使用宿主机网络，没有隔离                             | 性能敏感或需要完全暴露端口的场景        |
| **none**           | 不分配网络接口                                               | 需要完全自定义网络的场景                |

#### 1. 查看网络

```bash
docker network ls
```

#### 2. 创建自定义网络（推荐）

```bash
docker network create mynet
```

#### 3. 在同一网络启动容器

```bash
docker run -d --name web --network mynet nginx
docker run -it --name busybox --network mynet busybox sh
```

在 busybox 容器里：

```bash
ping web
```

会成功，因为容器名会解析为 IP（内置 DNS）。

**优势**：用自定义网络，容器之间可以通过 **服务名** 互联，不用写死 IP。

---

### 二、Docker 数据卷深入

容器默认的数据是临时的，容器删除数据就没了，所以需要 **数据卷（volume）** 来持久化。

#### 1. 数据卷类型

| 类型         | 挂载方式                              | 特点                                |
| ------------ | ------------------------------------- | ----------------------------------- |
| **匿名卷**   | `docker run -v /app/data`             | 无指定路径，Docker 自动生成 ID 目录 |
| **具名卷**   | `docker run -v mydata:/app/data`      | 方便复用和管理                      |
| **绑定挂载** | `docker run -v /宿主机路径:/容器路径` | 宿主机与容器实时同步                |

---

#### 2. 创建具名卷

```bash
docker volume create mydata
```

#### 3. 查看卷信息

```bash
docker volume inspect mydata
```

#### 4. 挂载数据卷

```bash
docker run -d -v mydata:/var/lib/mysql mysql
```

- 容器内 `/var/lib/mysql` 会持久化到卷 `mydata`
- 即使容器删掉，数据依然存在

---

#### 5. 绑定挂载（开发常用）

```bash
docker run -d -p 8080:80 -v $(pwd):/usr/share/nginx/html nginx
```

- 宿主机当前目录 → 容器 nginx 网页目录
- 改本地文件，容器立即生效（热更新）

---

### 三、网络 + 数据卷 实战案例

我们可以做一个：

- **Node.js 容器** + **MySQL 容器**
- 使用 **自定义网络** 互联
- 使用 **具名卷** 持久化数据库

`docker-compose.yml` 例子：

```yaml
version: "3.8"

services:
  web:
    image: node:18
    working_dir: /app
    volumes:
      - ./src:/app
    ports:
      - "8082:3000"
    command: sh -c "npm install && node server.js"
    depends_on:
      - db
    networks:
      - mynet

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - mynet

volumes:
  db_data:

networks:
  mynet:
```

这样：

- `mynet` 网络保证容器能用服务名互访
- `db_data` 卷保证 MySQL 数据持久化

---

我可以帮你画一张 **Docker 网络与数据卷的可视化图**，用图把这两个知识点一次搞透，你要我画吗？这样你就能形象理解它们的关系。

## 综合实战

好，那我们做一个 **Docker 综合实战项目**，一次用到你学过的：

- **自定义网络**
- **数据卷持久化**
- **多容器管理 (docker-compose)**
- **镜像构建 (Dockerfile)**

我们来做一个完整的 **Node.js + MySQL + Nginx 反向代理** 项目：

- **MySQL**：存储数据，持久化到卷
- **Node.js**：提供 API，连接 MySQL
- **Nginx**：反向代理 Node 服务，并提供静态页面

---

### 1. 项目结构

```
myapp/
  docker-compose.yml
  init.sql
  node/
    Dockerfile
    package.json
    server.js
  nginx/
    default.conf
    index.html
```

---

### 2. MySQL 初始化脚本

#### `init.sql`

```sql
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');
```

---

### 3. Node 服务

#### `node/Dockerfile`

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "server.js"]
```

`node/package.json`

```json
{
  "name": "node-mysql-app",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0"
  }
}
```

#### `node/server.js`

```javascript
const express = require("express")
const mysql = require("mysql2")

const app = express()
const port = 3000

const connection = mysql.createConnection({
  host: "db",
  user: "root",
  password: "example",
  database: "testdb",
})

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send("数据库查询失败: " + err.message)
    } else {
      res.json(results)
    }
  })
})

app.listen(port, () => {
  console.log(`Node API running at http://localhost:${port}`)
})
```

---

### 4. Nginx 配置

#### `nginx/default.conf`

```nginx
server {
    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }

    location /api/ {
        proxy_pass http://web:3000/;
    }
}
```

#### `nginx/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Docker 综合实战</title>
  </head>
  <body>
    <h1>欢迎来到 Docker 综合实战</h1>
    <p>访问 <a href="/api/users">用户列表</a></p>
  </body>
</html>
```

---

### 5. `docker-compose.yml`

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/index.html:/usr/share/nginx/html/index.html
    depends_on:
      - web
    networks:
      - mynet

  web:
    build: ./node
    container_name: my-node
    depends_on:
      - db
    networks:
      - mynet

  db:
    image: mysql:8.0
    container_name: my-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - mynet

volumes:
  db_data:

networks:
  mynet:
```

---

### 6. 启动项目

```bash
docker-compose up -d --build
```

---

### 7. 测试

1. 浏览器访问：

   ```
   http://localhost:8080
   ```

   会看到静态首页

2. 点击 “用户列表” 链接，访问：

   ```
   http://localhost:8080/api/users
   ```

   会返回：

   ```json
   [
     { "id": 1, "name": "Alice" },
     { "id": 2, "name": "Bob" },
     { "id": 3, "name": "Charlie" }
   ]
   ```

---

这个综合项目把 **网络、数据卷、Dockerfile、docker-compose** 全部结合起来，你已经能独立完成小型容器化部署了。
如果你愿意，我可以帮你把这个项目 **改造成生产可部署版本**，加上 **环境变量管理、热更新、健康检查**。这样就是一套企业级部署方案了。

你想直接升级到这个版本吗？

## 生产版本

好，我们把这个 Node.js + MySQL + Nginx 项目升级成 **生产可部署版本**，重点加上以下特性：

1. **环境变量管理**（支持生产/开发切换）
2. **Node 热更新（开发模式） & 生产构建**
3. **Docker 健康检查**（healthcheck）
4. **Nginx 缓存 & 压缩**
5. **最小化镜像体积（多阶段构建）**

---

### 1. `.env` 文件（环境变量）

```
NODE_ENV=production
PORT=3000
DB_HOST=db
DB_USER=root
DB_PASSWORD=example
DB_NAME=testdb
```

> 生产部署时，只需要换成 `.env.production` 或通过 Docker secrets/环境变量覆盖。

---

### 2. Node 服务优化

#### `node/Dockerfile`（多阶段构建）

```dockerfile
# 构建阶段
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .

# 运行阶段（使用更小的镜像）
FROM node:18-slim
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
CMD ["node", "server.js"]

# 健康检查（容器级）
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/users || exit 1
```

---

### 3. Nginx 优化配置

```
nginx/default.conf
server {
    listen 80;

    gzip on;
    gzip_types text/plain application/json text/css application/javascript;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        expires 1h;
    }

    location /api/ {
        proxy_pass http://web:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 4. docker-compose.yml（生产版）

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/index.html:/usr/share/nginx/html/index.html
    depends_on:
      - web
    networks:
      - mynet

  web:
    build:
      context: ./node
      dockerfile: Dockerfile
    container_name: my-node
    restart: on-failure
    env_file:
      - .env
    depends_on:
      - db
    networks:
      - mynet

  db:
    image: mysql:8.0
    container_name: my-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - db_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - mynet

volumes:
  db_data:

networks:
  mynet:
```

---

### 5. 部署步骤

```bash
# 1. 构建并启动
docker-compose --env-file .env up -d --build

# 2. 查看容器健康状态
docker ps

# 3. 日志查看
docker-compose logs -f
```

---

### 6. 优化要点

- **安全**：生产 MySQL 密码不要写死在文件，建议用 `docker secret` 或 `.env`
- **可扩展性**：`nginx` 可以换成负载均衡模式支持多 Node 容器
- **性能**：开启 gzip 压缩、缓存，减少带宽占用
- **稳定性**：`healthcheck` 确保服务异常时可自动重启

---

如果你要在 **云服务器部署**（比如阿里云/腾讯云/EC2），我可以帮你直接写 **一键部署脚本**，包括防火墙开放、自动构建、容器启动，让它真正上线可访问。
这样就能直接公网访问。
