#!/usr/bin/env bash

if [ -d "./dist" ];then
  echo "\033[31m ====dist文件夹已存在=======end====\033[0m"
  read -p "您是否要重新执行打包命令(y/n): " command
  if [ "$command" == "y" ];then
  rm -rf dist
  exitIfNeed '删除dist文件失败'
  echo -e "\033[44;37mcommand =====开始build========start=====\033[0m"
  yarn build
  exitIfNeed '====Build uboot failed!===='
  fi
else
  rm -rf dist
  exitIfNeed '删除dist文件失败'
  echo -e "\033[44;37mcommand =====开始build========start=====\033[0m"
  yarn build
  exitIfNeed '====Build uboot failed!===='
fi

read -p "您是否要执行上传npm包命令(y/n): " command
if [ "$command" == "y" ];then
    echo -e "\033[44;37mcommand: 开始执行publish... ...上传\033[0m"
    # npm login
    npm version patch
    npm publish
    exit
elif [ $command == 'n' ];then
  echo -e "\033[31m程序已终止... ...end\033[0m"
  exit
fi

exitIfNeed '====Build uboot failed!===='
exit 0