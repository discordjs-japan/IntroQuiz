#!/bin/bash
echo -e "\e[1;32mDownloading scripts\e[0m"
wget https://dl.rht0910.tk/travis-scripts.zip -q
wget https://dl.rht0910.tk/stopbuild -q
if [ "$?" != 0 ]; then
  echo -e "\e[1;32mExtracting scripts\e[0m"
  unzip travis-scripts.zip
  chmod 777 scripts/*.sh
  echo -e "\e[1;32mRemoving file\e[0m"
  rm travis-scripts.zip
  echo -e "\e[1;32mInstalling\e[0m"
  scripts/install.sh
  echo -e "\e[1;32mRunning script\e[0m"
  scripts/script.sh
else
  echo -e "\e[1;33mstopbuild has been downloaded, stopping this build, and this build will be failed.\e[0m"
  false
fi
