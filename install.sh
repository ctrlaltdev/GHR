#!/usr/bin/env sh

SCRIPTPATH=$(dirname "$0")
cd "$SCRIPTPATH"
ABSPATH=$(pwd)
cd -

exit

if [ ! -f $ABSPATH/.env ]; then
  cp $ABSPATH/.env.example $ABSPATH/.env
  echo Remember to add your GitHub Personal Token to $ABSPATH/.env
fi

cd $ABSPATH
npm ci --only=prod > /dev/null
cd -

if [ ! -d $HOME/.local/bin ]; then
  mkdir -p $HOME/.local/bin
fi

ln -sf $ABSPATH/GHR $HOME/.local/bin/GHR
ln -sf $ABSPATH/GHRC $HOME/.local/bin/GHRC
ln -sf $ABSPATH/GHPR $HOME/.local/bin/GHPR
ln -sf $ABSPATH/GHCL $HOME/.local/bin/GHCL
