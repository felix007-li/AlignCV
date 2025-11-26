# pgAdmin4 连接配置指南

## 🌐 访问 pgAdmin4

打开浏览器访问：**http://localhost:5050**

### 登录信息
- **邮箱**: `admin@aligncv.com`
- **密码**: `admin123`

---

## 🔌 添加 AlignCV 数据库服务器

登录后，按以下步骤添加数据库连接：

### 步骤 1: 添加新服务器
1. 右键点击左侧 **"Servers"**
2. 选择 **"Register" → "Server..."**

### 步骤 2: General 标签页
- **Name**: `AlignCV Local`
- **Server group**: `Servers`
- **Comments**: `AlignCV PostgreSQL Database`

### 步骤 3: Connection 标签页
填写以下信息：

```
Host name/address:     host.docker.internal
Port:                  5432
Maintenance database:  aligncv
Username:              app_user
Password:              app_password
Save password:         ✅ 勾选
```

**重要**: 在 Docker 中运行的 pgAdmin4 需要使用 `host.docker.internal` 来访问主机的 PostgreSQL。

### 步骤 4: Advanced 标签页（可选）
- **DB restriction**: `aligncv` （只显示 aligncv 数据库）

### 步骤 5: 保存
点击 **"Save"** 按钮。

---

## ✅ 连接成功后

展开左侧树形菜单：
```
Servers
  └── AlignCV Local
      └── Databases
          └── aligncv
              └── Schemas
                  └── public
                      └── Tables
                          ├── users
                          ├── resumes
                          ├── orders
                          ├── subscriptions
                          ├── refresh_tokens
                          ├── cover_letters
                          └── webhook_events
```

---

## 🎯 常用操作

### 查看表数据
1. 展开 `Tables`
2. 右键点击表名（如 `users`）
3. 选择 **"View/Edit Data" → "All Rows"**

### 执行 SQL 查询
1. 右键点击 `aligncv` 数据库
2. 选择 **"Query Tool"**
3. 输入 SQL 查询
4. 点击 ▶️ 运行按钮

### 导出数据
1. 右键点击表名
2. 选择 **"Backup..."**
3. 选择格式和保存位置

---

## 🔍 示例 SQL 查询

```sql
-- 查看所有用户
SELECT * FROM users ORDER BY "createdAt" DESC;

-- 查看用户的简历
SELECT 
    u.name as user_name,
    u.email,
    r.title as resume_title,
    r."templateId",
    r."createdAt"
FROM users u
LEFT JOIN resumes r ON u.id = r."userId"
ORDER BY r."createdAt" DESC;

-- 统计信息
SELECT 
    COUNT(*) as total_users,
    COUNT(DISTINCT r.id) as total_resumes
FROM users u
LEFT JOIN resumes r ON u.id = r."userId";
```

---

## 🛠️ 故障排除

### 问题：无法连接到数据库

**解决方案 1**: 确认 PostgreSQL 容器正在运行
```bash
docker ps | grep postgres
```

**解决方案 2**: 使用 localhost 替代 host.docker.internal
某些系统配置可能需要使用 `localhost` 或 `127.0.0.1`

**解决方案 3**: 检查端口是否开放
```bash
lsof -i :5432
```

### 问题：密码错误

确认使用正确的凭据：
- Username: `app_user`
- Password: `app_password`
- Database: `aligncv`

---

## 📦 管理 pgAdmin4 容器

```bash
# 停止 pgAdmin4
docker stop pgadmin4

# 启动 pgAdmin4
docker start pgadmin4

# 查看日志
docker logs pgadmin4

# 删除容器
docker rm -f pgadmin4
```

---

## 🎨 界面功能

- **Dashboard**: 显示服务器统计和活动会话
- **Query Tool**: 执行 SQL 查询
- **ERD Tool**: 可视化表关系图
- **Schema Diff**: 比较数据库架构差异
- **Import/Export**: 数据导入导出
- **Backup/Restore**: 数据库备份恢复
