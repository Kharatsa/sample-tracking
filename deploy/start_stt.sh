#!/bin/bash -ex

FINISHED_MARKER=/home/stt/fin

echo "Building with NODE_ENV=\"${NODE_ENV}\""

if [ ! -f "$FINISHED_MARKER" ]; then
  gulp build # Compile/build app

  # Check for successful exit code
  if [ "$?" -eq 0 ]
  then
    touch $FINISHED_MARKER
  else
    exit $?
  fi

fi

if [ "$NODE_ENV" = "production" ]
then
  echo "Starting production server"
  npm start
else
  echo "Starting development server"
  node_modules/.bin/nodemon app/server
fi
