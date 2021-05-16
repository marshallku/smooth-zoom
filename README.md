# Smooth Zoom

A light weight javascript library for zooming images like Medium, Google Photos and more.

![Zoom example](https://blog.kakaocdn.net/dn/bGIJcB/btqXgnLZRC1/YSa09cEo2qD1ntYCvhCNWK/img.gif)

[👀 Demo](https://smooth-zoom.marshall-ku.com)

## Install

```
npm install smooth-zoom
# or
yarn add smooth-zoom
```

## Usage

Import with script tag

```html
<script src="node_modules/smooth-zoom/dist/zoom.browser.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/smooth-zoom@latest/dist/zoom.browser.js"></script>
```

Import as module

```javascript
import Zoom from "smooth-zoom";
```

And calling it with any css-selector, HTMLElement (or Array of it), and NodeList will make your image zoomed on click.

```javascript
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

## Options

```javascript
Zoom(".zoomable", {
    originalizer: (src) => src.replace(/-[0-9]+\.jpg/, ".jpg"),
    background: "auto",
});
```

| Property     | Type                    | Default      | Description                                                               |
| ------------ | ----------------------- | ------------ | ------------------------------------------------------------------------- |
| originalizer | (src: string) => string | (src) => src | Change images' src to original src                                        |
| background   | string                  | rgb(0, 0, 0) | Image's background color.<br>Use "auto" to get average color of the image |

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
