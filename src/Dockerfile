# 阶段 1：编译环境 (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包含 devDependencies，因为需要 nest cli 编译）
RUN npm ci

# 复制所有源代码
COPY . .

# 编译成 dist
RUN npm run build

# 阶段 2：生产运行环境 (Production)
FROM node:20-alpine

WORKDIR /app

# 再次复制 package.json
COPY package*.json ./

# 这一次只安装生产环境需要的依赖（去掉开发工具，让镜像变得非常小）
RUN npm ci --only=production

# 从 builder 阶段把编译好的 dist 文件夹拿过来
COPY --from=builder /app/dist ./dist

# 声明容器内部运行的端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/main.js"]