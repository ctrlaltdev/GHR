#!/usr/bin/env sh

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

if [ ! -f $SCRIPTPATH/.env ]; then
  cp $SCRIPTPATH/.env.example $SCRIPTPATH/.env
  echo Remember to add your GitHub Personal Token to $SCRIPTPATH/.env
fi

npm ci --only=prod > /dev/null

if [ ! -d $HOME/.local/bin ]; then
  mkdir -p $HOME/.local/bin
fi

ln -sf $SCRIPTPATH/GHR $HOME/.local/bin/GHR
ln -sf $SCRIPTPATH/GHRC $HOME/.local/bin/GHRC
ln -sf $SCRIPTPATH/GHPR $HOME/.local/bin/GHPR
ln -sf $SCRIPTPATH/GHCL $HOME/.local/bin/GHCL
