# Smooth Zoom

A light weight javascript library for zooming images.

![Zoom example](https://blog.kakaocdn.net/dn/ZAoBG/btqXb2GoVUf/ug9krF5SeoBaW8QvERBOj0/img.gif)

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

And calling it with any css-selector will make your image zoomed on click.

```javascript
Zoom(".zoomable");
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
