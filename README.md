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

##### All images from source resizable and compressed:
- max 1280 heigh, because the level.
- export images from source to .webp(lighter size than .png), use compress, сompare quality and choose.

##### Alls audio used to convert from source to new .mp3 files, prefer:
- Mono, quality 100%, or stereo if mono broke the sample.
- Sample rate, sound 11025 Hz - 22050 Hz(prefer).
- 16 bit bit depth.
- export (Audition) Bitrate see options from 11024 or 22050 Hz(prefer 24 - 40 Kbps, see how broke sample).
- export (Audition) remove checkbox markers and metadata.
- check .aac in container .m4a, for better quality and size than .mp3
