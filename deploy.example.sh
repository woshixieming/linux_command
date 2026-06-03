#!/bin/bash

# ============================================
# Linux 命令学习站 - 构建部署脚本
# ============================================

# -------- 配置区域 --------
# 方式一：SSH 密钥登录（推荐）
SSH_HOST="your-server.com"
SSH_PORT="22"
SSH_USER="root"
SSH_KEY="~/.ssh/id_ed25519"                    # 密钥路径，如 ~/.ssh/id_rsa
SSH_PATH="/var/www/html/"                      # 服务器目录

# 方式二：SSH 别名（需要在 ~/.ssh/config 中配置）
# 配置后填入别名即可，优先使用密钥
SSH_ALIAS=""

# -------- 勿修改以下内容 --------
DIST_DIR="./app/dist"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${CYAN}[STEP]${NC} $1"; }

# 检查配置
check_config() {
    local host="" user=""

    if [[ -n "$SSH_ALIAS" ]]; then
        log_info "使用 SSH 别名: $SSH_ALIAS"
        host="$SSH_ALIAS"
    elif [[ -n "$SSH_HOST" ]]; then
        host="$SSH_HOST"
        user="$SSH_USER"
    else
        log_error "请配置服务器信息！"
        echo ""
        echo "请选择以下方式之一："
        echo ""
        echo "方式一：SSH 密钥登录（推荐）"
        echo "  编辑脚本填入："
        echo "    SSH_HOST=\"your-server.com\""
        echo "    SSH_USER=\"root\""
        echo "    SSH_KEY=\"~/.ssh/id_rsa\""
        echo ""
        echo "方式二：SSH 别名（需先配置 ~/.ssh/config）"
        echo "  SSH_ALIAS=\"my-server\""
        echo ""
        exit 1
    fi

    DEPLOY_HOST="$host"
    DEPLOY_USER="$user"
}

# 构建项目
build_project() {
    log_step "1/3 开始构建..."
    cd "$(dirname "$0")" || exit 1

    if [[ ! -d "app/node_modules" ]]; then
        log_info "安装依赖..."
        cd app && npm install && cd ..
    fi

    log_info "执行构建..."
    cd app && npm run build
    if [[ $? -ne 0 ]]; then
        log_error "构建失败！"
        exit 1
    fi
    cd ..

    if [[ ! -d "$DIST_DIR" ]]; then
        log_error "构建输出目录不存在: $DIST_DIR"
        exit 1
    fi

    log_info "构建完成 ✓"
}

# 部署到服务器
deploy() {
    log_step "2/3 开始部署..."

    local dest=""
    if [[ -n "$SSH_ALIAS" ]]; then
        dest="${SSH_ALIAS}:${SSH_PATH}"
    elif [[ -n "$SSH_USER" ]]; then
        dest="${SSH_USER}@${SSH_HOST}:${SSH_PATH}"
    fi

    log_info "目标: $dest"

    if [[ -n "$SSH_KEY" ]] || [[ -n "$SSH_ALIAS" ]]; then
        # SSH 密钥登录
        local ssh_cmd="ssh -o StrictHostKeyChecking=no"
        [[ -n "$SSH_PORT" && "$SSH_PORT" != "22" ]] && ssh_cmd="$ssh_cmd -p $SSH_PORT"
        [[ -n "$SSH_KEY" ]] && ssh_cmd="$ssh_cmd -i $SSH_KEY"

        log_info "使用 SSH 密钥登录"
        rsync -avz --delete \
            -e "$ssh_cmd" \
            "$DIST_DIR/" \
            "$dest"
    else
        log_error "未配置密钥或别名！"
        exit 1
    fi

    if [[ $? -eq 0 ]]; then
        log_info "部署成功 ✓"
    else
        log_error "部署失败！"
        exit 1
    fi
}

# 生成 SSH 密钥指南
show_key_guide() {
    echo ""
    echo "============================================"
    echo "  SSH 密钥配置指南"
    echo "============================================"
    echo ""
    echo "1. 生成密钥对："
    echo "   ssh-keygen -t ed25519 -C \"your_email@example.com\""
    echo "   # 按回车选择默认路径，可设密码保护"
    echo ""
    echo "2. 上传公钥到服务器："
    echo "   ssh-copy-id -p 22 user@your-server.com"
    echo "   # 输入密码后，公钥会自动添加"
    echo ""
    echo "3. 测试登录："
    echo "   ssh user@your-server.com"
    echo ""
    echo "4. 配置别名（可选）："
    echo "   # 编辑 ~/.ssh/config"
    echo "   Host myserver"
    echo "       HostName your-server.com"
    echo "       User root"
    echo "       Port 22"
    echo "       IdentityFile ~/.ssh/id_ed25519"
    echo ""
    echo "============================================"
}

# 主流程
main() {
    echo ""
    echo "  ╔═══════════════════════════════════════╗"
    echo "  ║    Linux 命令学习站 - 部署脚本        ║"
    echo "  ╚═══════════════════════════════════════╝"
    echo ""

    check_config
    build_project
    deploy

    local url="http://${DEPLOY_HOST}${SSH_PATH#/}"
    echo ""
    echo "============================================"
    log_info "部署完成！"
    echo "  访问地址: $url"
    echo "============================================"
    echo ""
}

# 帮助
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助"
    echo "  --key-guide    显示 SSH 密钥配置指南"
    echo ""
    echo "配置方式（编辑脚本文件）："
    echo "  SSH_ALIAS      SSH 别名（需要 ~/.ssh/config）"
    echo "  SSH_HOST       服务器地址"
    echo "  SSH_USER       用户名"
    echo "  SSH_KEY        密钥路径"
    echo "  SSH_PATH       服务器目录"
    exit 0
fi

if [[ "$1" == "--key-guide" ]]; then
    show_key_guide
    exit 0
fi

main "$@"
