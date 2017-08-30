#!/bin/sh
set -e

remove_log_file () {
  [ -e "${APP_DIR}/.next" ] && rm -rf "${APP_DIR}/.next"
  [ -e "${APP_DIR}/npm-debug.log" ] && rm -rf "${APP_DIR}/npm-debug.log"
  echo "rm -rf ${APP_DIR}/.next ${APP_DIR}/npm-debug.log"
}

case "$1" in
  "sh" ) exec "bash";;

  "npm" | "yarn" )
    remove_log_file
    yarn install
    exec "$@";;

  "--dev" )
    remove_log_file
    yarn install
    exec npm run dev;;

  "--build" )
    remove_log_file
    yarn install
    exec npm run build;;

  "--start" )
    remove_log_file
    yarn install
    npm run build
    exec npm run start;;

  * ) exec "$@";;
esac
