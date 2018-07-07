#!/bin/bash
apt install unzip
wget https://dl.rht0910.tk/travis-scripts.zip
unzip travis-scripts.zip
chmod 777 scripts/*.sh
echo "Installing"
scripts/install.sh
echo "Running script"
scripts/script.sh
