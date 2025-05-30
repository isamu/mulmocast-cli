# mulmocast-cli

## Initialization

Install dependencies.

```
yarn install
brew install ffmpeg # Or install ffmpeg from https://ffmpeg.org/download.html
```

Create .env file.

```
OPENAI_API_KEY={your OpenAI key}
GOOGLE_PROJECT_ID={your Google Project ID}
NIJIVOICE_API_KEY={your Nijivoice API key}
```

## Create a podcast episode

1. Feed some source text (ideas, news, press releases) to your favarite LLM.
2. Ask the LLM to write a podcast script in JSON (use the contents of "./prompt.md").
3. Create a json file with that generated JSON (such as ./scripts/elon.json)
4. Run ```yarn run gen {path to the script file}```.
5. The output will be generated in the ./output folder.

## Create a video

1. Claudeを使って台本（MulmoScript）を作成
2. 各セリフにimagePromptを追加（src/imagep.tsを使用）
3. セリフの分割（src/split.tsを使用、オプション）
4. セリフの修正（src/fixtext.tsを使用、オプション）
5. Youtubeライブ向けの縦動画であれば、その指示を追加（手作業）
6. 音声ファイルの作成（src/audio.tsを使って自動作成）
7. 画像ファイルの作成（src/images.tsを使って自動生成）
8. 映像ファイルの作成（src/movie.tsを使って自動生成）

# Script format

```Javascript
{
  "title": "title of the podcast",
  "description": "The description of the podcast.",
  "reference": "URL to the source data", // optional
  "tts": "openAI", // or "nijivoice", default is "openAI"
  "speakers": {
    "Host": {
      "voiceId": "shimmer",
      "displayName": {
        "en": "Host"
      }
    },
    "Guest": {
      "voiceId": "echo",
      "displayName": {
        "en": "Guest"
      }
    }
  },
  "beats": [
    {
      "speaker": "Host",
      "text": "words from the host."
    },
    {
      "speaker": "Guest",
      "text": "words from the guest."
    },
    ...
  ]
}
```

## Translate the script into Japanese

Run ```yarn run ja {path to the script file}```

## Create a movie file with the Japanese script

Run ```yarn run mov {path to the script file}```
