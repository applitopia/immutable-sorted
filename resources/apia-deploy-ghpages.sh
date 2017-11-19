#!/bin/sh -e

#  Copyright (c) 2017, Applitopia, Inc.
#
#  Modified source code is licensed under the MIT-style license found in the
#  LICENSE file in the root directory of this source tree.

# Copyright (c) 2014-present, Facebook, Inc.
#
# Original source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# This script maintains the ghpages branch hosted on applitopia.github.io

# Create empty gh-pages directory
rm -rf gh-pages
git clone -b gh-pages "https://github.com/applitopia/immutable-sorted.git" gh-pages

# Remove existing files first
rm -rf gh-pages/**/*
rm -rf gh-pages/*

# Copy over necessary files
cp -r pages/out/* gh-pages/

HEADREV=`git rev-parse HEAD`
echo $HEADREV

cd gh-pages
git config user.name "Applitopia"
git config user.email "public@applitopia.com"
git add -A .
if git diff --staged --quiet; then
  echo "Nothing to publish"
else
  git commit -a -m "Deploy $HEADREV to Applitopia GitHub Pages"
  git push origin gh-pages
  echo "Pushed"
fi
