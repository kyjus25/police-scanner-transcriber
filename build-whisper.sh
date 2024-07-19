#!/bin/sh

# PREREQUESITES
# - Ensure ~/Library/Python/3.9/bin is in path
# - - export PATH=$PATH:~/Library/Python/3.9/bin
# - Ensure XCode and command line tools are installed
# - - xcode-select --install
# - - export PATH="/Applications/Xcode-beta.app/Contents/Developer/usr/bin:$PATH"
# - - "coremlc" command from XCode app, note Xcode-beta because of Sequoia Beta

# Build Whisper.cpp with Metal (Core ML) support for MacOS
rm -rf .whisper
git clone https://github.com/ggerganov/whisper.cpp.git .whisper

pip3 install ane_transformers
pip3 install openai-whisper
pip3 install coremltools

cd .whisper

# https://github.com/ggerganov/whisper.cpp/blob/master/models/download-coreml-model.sh#L25C85-L25C93
# ./models/generate-coreml-model.sh large-v3
./models/generate-coreml-model.sh large-v3
./models/download-ggml-model.sh large-v3

make clean
WHISPER_COREML=1 make -j

make samples

# ./main -m models/ggml-large-v3.bin -f samples/jfk.wav