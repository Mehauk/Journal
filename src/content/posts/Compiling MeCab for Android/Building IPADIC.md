---
title: Building IPADIC
date: 2025-11-29
tags: [mecab, xml]
excerpt: Building the IPADIC dictiionary for use in Android
readTime: 5 min read
---

### The Rundown
We need to first configure and build `mecab` for our OS (not for our target android OS), which in our case is linux (through wsl). Afterwards we can run the configuration for `mecab-ipadic` (I am using 2.7.0). The `make` command should now be available to us and should complete the building of `IPADIC`.

### Building mecab for Linux
Start by running the configuration. afterwards build and install mecab. If successful you should see a mecab header file `mecab.h` under the prefixed directory - `/usr/local/include/mecab.h`.
```
cd ~/path/to/mecab-0.993
./configure --prefix=/usr/local

# build mecab
make

make install
```

### Building IPADIC
Your mecab directory should also contain a mecab-config file, we will be using this to configure the makefiles for ipadic. We also need to update the library path to point to our mecab install dir. Finally, we should be able to `make` `IPADIC` into `./build`.
```
cd ~/path/to/ipadic

# use $HOME, "~" does not seem to work
./configure --with-mecab-config=$HOME/path/to/mecab/mecab-config

export LD_LIBRARY_PATH=/usr/local/lib:\$LD_LIBRARY_PATH

make

mkdir build
cp *.bin *.dic dicrc left-id.def pos-id.def right-id.def rewrite.def ./build/
```
