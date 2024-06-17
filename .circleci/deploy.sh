#!/bin/bash -i
set -e
pwd
cd ~/HeartHead_ci/Heart-Heads
git restore .

git pull origin main

npm install --legacy-peer-deps
npm run build
pm2 restart 0
