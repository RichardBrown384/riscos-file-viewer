function mapSprite(sprite) {
    const {
        pixelWidth: width,
        pixelHeight: height,
        image,
        mask = [],
        palette
    } = sprite;
    const pixels = [];
    for (let n = 0; n < image.length; n++) {
        const {first: bgr_} = palette[image[n]];
        const alpha = (mask[n] === 0) ? 0 : 0xFF;
        pixels.push((bgr_ >> 8) & 0xFF);
        pixels.push((bgr_ >> 16) & 0xFF);
        pixels.push((bgr_ >> 24) & 0xFF);
        pixels.push(alpha);
    }
    return {
        width,
        height,
        pixels
    }
}
export default mapSprite;