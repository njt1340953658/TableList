#!/usr/bin/env bash

build() {
  rm -rf dist
  exitIfNeed '删除dist文件失败'
  yarn build
  exitIfNeed 'build failed!'
}

case "$1" in
 *)
  build
esac

if [ $? -eq 0 ]; then
		echo "====Build uboot ok!===="
    npm login
    npm publish
else
		echo "====Build uboot failed!===="
		exit 1

exitIfNeed 'build failed!'
exit 0