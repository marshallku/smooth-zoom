# Smooth Zoom

WIP...

![Zoom example](https://blog.kakaocdn.net/dn/ZAoBG/btqXb2GoVUf/ug9krF5SeoBaW8QvERBOj0/img.gif)

```javascript
Zoom(".my-image");
```

## Options

```javascript
Zoom("img", {
    originalizer: (src) => src.replace(/-[0-9]+\.jpg/, ".jpg"),
    background: "auto",
});
```

| Property     | Type                    | Default      | Description                                                               |
| ------------ | ----------------------- | ------------ | ------------------------------------------------------------------------- |
| originalizer | (src: string) => string | (src) => src | Change images' src to original src                                        |
| background   | string                  | rgb(0, 0, 0) | Image's background color.<br>Use "auto" to get average color of the image |
