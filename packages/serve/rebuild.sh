#!/usr/bin/env sh

# 忽略错误
set -e

# ./node_modules/.bin/electron-rebuild.cmd
./node_modules/.bin/electron-rebuild -f -w better-sqlite3
