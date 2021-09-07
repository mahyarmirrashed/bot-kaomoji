# Kaomoji Discord Bot `\(^ヮ^)/`

This bot is created using TypeScript and Discord.js. It was originally meant for the University of Manitoba chapter of IEEE Discord Serverand was developed by Mahyar Mirrashed (Chair 2021-2022) as part of his incoming role during the summer.

## Generating new Kaomoji Data

To generate new data to enter as a Kaomoji, please use the following Python script:

```py
emojis = '''
'''.split('\n')

from json import dump
with open('out.txt', mode='w') as f:
  dump(emojis, f)
```

#### Credits

We would like to thank SmileX from [kaomoji.ru](https://kaomoji.ru) who provided most of the Kaomojis available with this bot.
