#!/bin/bash
git checkout -b travis-autofix
eslint *.js
eslint --fix *.js
git add *.js
git commit -m "Auto fixed in ESLint."
git pull
return git push
