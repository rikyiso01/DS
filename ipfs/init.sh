#!/usr/bin/env bash

set -euo pipefail

for filename in /import/*
do
    ipfs add -r "$filename"
done
