#!/usr/bin/env sh

# abort on errors
set -e

npm run build

cd dist

git init
git checkout -b main
git add -A
git commit -m 'deploy'
git push -f https://github.com/bigjey/flame.git main:gh-pages

cd -