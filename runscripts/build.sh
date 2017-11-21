#!/usr/bin/env bash

cd "$(dirname "$0")/.."
set -e

yarn check
yarn compare
gulp build
