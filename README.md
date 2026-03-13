# Chicken Road Gold game

Before npm run build for not forget:
``
npm run lint -- --fix
``

Requirements:
```
npm install @tweenjs/tween.js
npm install @pixi/sound
npm install solid-js
npm install -D vite-plugin-solid
```

#### In future:
- Better change audio library fromv @pixi/sound to howler.js(Audio Sprites base64 overhead, library size, for ui solidjs).
- Add an API to process requests from the server.

##### All images from source resizable and compressed:
- max 1280 height, because the level.
- export images from source to .webp(lighter size than .png), use compress, сompare quality and choose.

##### Alls audio used to convert from source to new .mp3 files, prefer:
- Mono, quality 100%, or stereo if mono broke the sample from source.
- Sample rate, sound 11025 Hz, 22050 Hz(prefer) and more.
- 16 bit bit depth.
- export (Audition) Bitrate see options for your Sample rate, test and see how broke the sample from source.
- export (Audition) remove checkbox markers and metadata.
