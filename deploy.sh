#!/usr/bin/env sh

# 构建
npm run build

# 进入构建输出目录
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:你的用户名/workout-plan-generator.git main:gh-pages

cd -
