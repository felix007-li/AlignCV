#!/bin/bash
# AlignCV 数据库查询脚本

CONTAINER="postgres-interview"
USER="app_user"
DB="aligncv"

# 函数：执行查询
query() {
    docker exec $CONTAINER psql -U $USER -d $DB -c "$1"
}

# 菜单
echo "╔════════════════════════════════════════╗"
echo "║   AlignCV PostgreSQL 数据库查询工具   ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "使用方法："
echo "  ./db-queries.sh stats        # 查看统计"
echo "  ./db-queries.sh users        # 查看用户"
echo "  ./db-queries.sh resumes      # 查看简历"
echo "  ./db-queries.sh orders       # 查看订单"
echo "  ./db-queries.sh tokens       # 查看令牌"
echo "  ./db-queries.sh all          # 查看所有数据"
echo "  ./db-queries.sh \"YOUR SQL\"  # 自定义查询"
echo ""

case "$1" in
    stats)
        echo "📊 数据库统计："
        query "SELECT 
          'users' as table_name, COUNT(*) as count FROM users
        UNION ALL
        SELECT 'resumes', COUNT(*) FROM resumes
        UNION ALL
        SELECT 'orders', COUNT(*) FROM orders
        UNION ALL
        SELECT 'subscriptions', COUNT(*) FROM subscriptions
        UNION ALL
        SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
        ORDER BY table_name;"
        ;;
    
    users)
        echo "👥 用户数据："
        query 'SELECT id, email, name, locale, "createdAt" FROM users ORDER BY "createdAt" DESC;'
        ;;
    
    resumes)
        echo "📄 简历数据："
        query 'SELECT id, "userId", title, "templateId", locale, "isActive", "createdAt" FROM resumes ORDER BY "createdAt" DESC;'
        ;;
    
    orders)
        echo "💰 订单数据："
        query 'SELECT id, "userId", mode, status, amount, currency, plan, "createdAt" FROM orders ORDER BY "createdAt" DESC;'
        ;;
    
    tokens)
        echo "🔑 刷新令牌："
        query 'SELECT id, "userId", LEFT(token, 30) || '\''...'\'' as token, "expiresAt", "createdAt" FROM refresh_tokens ORDER BY "createdAt" DESC;'
        ;;
    
    all)
        $0 stats
        echo ""
        $0 users
        echo ""
        $0 resumes
        echo ""
        $0 orders
        ;;
    
    "")
        # 显示帮助（已在上面显示）
        ;;
    
    *)
        echo "执行自定义查询："
        query "$1"
        ;;
esac
