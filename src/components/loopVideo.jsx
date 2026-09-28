/* Autoplaying, looping, no controls: behaves like an animated image. muted is required or
   browsers block autoplay; playsInline stops iOS forcing fullscreen; blocking the context
   menu removes the right-click play/pause and "show controls" options. */
function LoopVideo({ src, className }) {
    return (
        <video
            src={src}
            className={`loop-video ${className || ''}`}
            autoPlay muted loop playsInline
            disablePictureInPicture
            onContextMenu={e => e.preventDefault()}
        />
    )
}

export default LoopVideo
