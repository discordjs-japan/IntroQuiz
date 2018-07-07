const ERROR = "error"
const WARNING = (process.env.STRICT_LINT == true || process.env.CI == true) ? "error" : "warn"
const OFF = "off"
git checkout -b travis-autofix
eslint *.js
eslint --fix *.js
git add *.js
git commit -m "Auto fixed in ESLint."
error code
