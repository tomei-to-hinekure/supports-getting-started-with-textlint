#!/usr/bin/env bash

textlint 'no-existence/**/*.md'
# 終了ステータスが`2`である場合、終了ステータスを`0`として扱う
if [ $? -eq 2 ]; then
  exit 0
fi
