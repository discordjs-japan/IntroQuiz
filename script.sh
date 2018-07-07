#!/bin/bash
echo "Installing unzip..."
apt install unzip
echo "Downloading scripts"
wget https://dl.rht0910.tk/travis-scripts.zip
echo "Extracting file"
unzip travis-scripts.zip
chmod 777 scripts/*.sh
echo "Removing files"
rm travis-scripts.zip
echo "Installing"
scripts/install.sh
echo "Running script"
scripts/script.sh
