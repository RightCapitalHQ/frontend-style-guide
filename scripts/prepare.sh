#!/usr/bin/env bash

# Prepare the environment for development
# this script is used in package.json

script_name=$(basename "$0")
if [[ -n $CI ]]; then
  echo "CI environment detected, skipping ${script_name}"
  exit 0
fi

echo "Start preparing the environment for development"

echo "-> Configuring husky"
pnpm exec husky

echo "Finished preparing the environment for development"
