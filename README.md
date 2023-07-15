# Smooth Zoom

[![License](https://img.shields.io/npm/l/medium-zoom.svg)](https://www.npmjs.com/package/smooth-zoom)
[![NPM Version](https://img.shields.io/npm/v/smooth-zoom.svg)](https://www.npmjs.com/package/smooth-zoom)
[![Known Vulnerabilities](https://snyk.io/test/github/marshallku/smooth-zoom/badge.svg)](https://snyk.io/test/github/marshallku/smooth-zoom)
[![NPM Downloads](https://img.shields.io/npm/dm/smooth-zoom.svg)](https://www.npmjs.com/package/smooth-zoom)
[![Dependencies](https://img.shields.io/badge/dependencies-0-lightgrey.svg)](https://www.npmjs.com/package/smooth-zoom)

A light weight javascript library for zooming images like Medium, Google Photos and more.

![Zoom example](https://blog.kakaocdn.net/dn/bGIJcB/btqXgnLZRC1/YSa09cEo2qD1ntYCvhCNWK/img.gif)

[👀 Demo](https://smooth-zoom.marshallku.com)

## Install

```
npm install smooth-zoom
# or
yarn add smooth-zoom
```

## Usage

Import with script tag

```html
<script src="node_modules/smooth-zoom/dist/zoom.min.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/smooth-zoom@latest/dist/zoom.min.js"></script>
```

Import as module

```ts
import Zoom from "smooth-zoom";
```

And calling it with any css-selector, HTMLElement (or Array of it), and NodeList will make your image zoomed on click.

```ts
// Css Selector
Zoom(".zoomable");

// HTMLElement || HTMLElement[]
Zoom(document.querySelector(".zoomable"));

Zoom([
    document.querySelector(".foo"),
    ...document.querySelectorAll(".zoomable"),
]);

// NodeList
Zoom(document.querySelectorAll(".zoomable"));
```

And you can simply use this with `useRef` in react.

```ts
import { useRef } from "react";
import Zoom from "smooth-zoom";

function App() {
    const zoom = useRef(Zoom());

    return <img src="https://example.com/" ref={zoom.current.attach} />;
}

export default App;
```

## Options

```javascript
Zoom(".zoomable", {
    background: "auto",
    onTransitionEnd: (img) => {
        img.src = img.src.replace(/-[0-9]+\.jpg/, ".jpg");
    },
});
```

| Property        | Type                            | Default             | Description                                                                          |
| --------------- | ------------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| background      | string                          | rgba(0, 0, 0, 0.95) | Image's background color.<br>Use `auto` to get average color of the image            |
| useMaximumSize  | boolean                         | true                | Find the longest width through image's natural width and `srcset` attribute          |
| onClick         | (img: HTMLImageElement) => void | undefined           | Function that fires on click. Note that img is **original** image element.           |
| onTransitionEnd | (img: HTMLImageElement) => void | undefined           | Function that fires after zoom animation. Note that img is **cloned** image element. |

## Methods

#### `zoom(img: HTMLImageElement) => void`

Zoom-in an image

```javascript
const zoom = Zoom();

zoom.zoom(document.querySelector("img"));
```

#### `attach(target: string | HTMLElement | NodeList | HTMLElement[]) => void`

Make the target zoomed on click

```javascript
const zoom = Zoom(".zoomable", {
    background: "rgba(0, 0, 0, .3)",
});

zoom.attach(".more-elements");
```
