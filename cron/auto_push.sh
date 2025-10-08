#!/bin/bash
set -e

cd /var/www/html/online-wooden || { echo "Lỗi: Không tìm thấy thư mục repository."; exit 1; }

echo "Bắt đầu auto-push lúc $(date)..."

# (Quan trọng) Cập nhật trạng thái từ remote trước khi push để tránh lỗi
git pull --rebase origin develop

# Thêm tất cả các file mới hoặc đã thay đổi
git add .

# Chỉ commit khi có thay đổi thực sự
if ! git diff-index --quiet --cached HEAD; then
  echo "Phát hiện thay đổi, đang commit..."
  git commit -m "Auto Backup: Cập nhật ngày $(date +'%Y-%m-%d %H:%M:%S')"
  git push origin develop
  echo "Push thành công."
else
  echo "Không có thay đổi nào để push."
fi

echo "Hoàn tất."
echo "--------------------"