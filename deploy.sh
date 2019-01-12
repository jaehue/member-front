#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build
REACT_APP_ENV=production yarn build

# Clean
rm -rf deploy/*
cp -R build/* deploy

# Go To deploy folder
cd deploy

# Add changes to git.
git add -A

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Come Back
cd ..