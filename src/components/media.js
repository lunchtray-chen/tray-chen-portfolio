const VIDEO_EXTENSIONS = ['webm', 'mp4']

/* imgseries entries ending in these render as a looping video instead of an <img>. */
export function isVideo(src) {
    return VIDEO_EXTENSIONS.includes(src.split('.').pop().toLowerCase())
}
