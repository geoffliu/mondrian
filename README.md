# Random Mondrian Generator

Lorem ipsum, but for images. See [full description](https://www.geoffliu.me/mondrian.html) for details.

## Usage

Install from NPM:

```
npm i gen-mondrian
```

The module exports a single default function that accepts a canvas element. When
run, it generates an image of 16:9 aspect ratio and fills the canvas.

```javascript
import genMondrian from 'gen-mondrian'

const el = document.getElementById('my-canvas')
genMondrian(el)
```

## TODOs
- [ ] Allow user to specify size of generated image
- [ ] Allow user to specify palettes
- [ ] Add some kind of testing


