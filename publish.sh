#!/usr/bin/env bash

build() {
  rm -rf dist
  exitIfNeed '删除dist文件失败'
  yarn build
  exitIfNeed '====Build uboot failed!===='
}

case "$1" in
 *)
  build
esac

verify=true

if  [[ $verify == true ]] ; then
read -p "您是否要执行上传npm包命令(y/n): " command
	if [ "$command" == "y" ]&&[ "$command" != "n" ];then
      echo -e "\033[44;37mcommand: 开始执行publish... ...上传\033[0m"
      npm login
      npm publish
      exit
	elif [[ $command == 'n' ]];then
    echo -e "\033[31m程序已终止... ...end\033[0m"
    exit
	fi
fi

exitIfNeed '====Build uboot failed!===='
exit 0