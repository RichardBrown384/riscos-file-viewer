# riscos-file-viewer

## About

React based viewer for RISC OS files.

Uses [RISC OS File Formats][riscos-file-formats-js] and [RISC OS ArtWorks][riscos-artworks-js]to load data from RISC OS files.

Hosted using GitHub pages for demonstration purposes [here][host].

## Draw support

### Supported features

1. Path objects
2. Sprite objects
3. Transformed objects

### Unsupported features

1. Text objects
2. JPEG objects

## Font support

### Supported features

1. Rendering of Outline files in a grid

### Unsupported features

1. Bitmap fonts
2. Metrics

## ArtWorks support

ArtWorks file support is experimental and incomplete.

### Supported features

1. Path objects

### Unsupported features

1. Sprite objects
2. Blend objects
3. Path start and end markers

## Project status

Project is offered as-is and as a tool for making further observations and improvements.

---
[riscos-file-formats-js]: https://github.com/RichardBrown384/riscos-file-formats-js
[riscos-artworks-js]: https://github.com/RichardBrown384/riscos-artworks-js
[host]: http://richardbrown384.github.io/riscos-file-viewer
