import './overlay.css'
import Keyword from './keyword'
import BlenderModel from './blenderModel.jsx'
import ProtectedImg from './protectedImg.jsx'

/* Locked projects hold R2 keys instead of public paths, so their images go through the
   gate. Everything else renders a plain <img> exactly as before. */
function overlayImg(project, token, src, className) {
    return project.locked
        ? <ProtectedImg key={src} assetKey={src} token={token} className={className} />
        : <img key={src} src={src} className={className} />
}

function NormalOverlay({ project, setActiveOverlay, token }) {
    return (
        <div className={`overlay-content flex-col ${project.type}`} onClick={e => e.stopPropagation()}>
            <button className='close-overlay' onClick={() => setActiveOverlay(null)}><h3>X</h3></button>
            <div className='project-info flex-row'>
                <div className='info-text flex-col'>
                    <h4>{project.name}</h4>
                    <Keyword keywords={project.keywords} />
                    <p>{project.timeframe}<br />Tools: {project.tools}</p>
                    <p>{project.longdesc}</p>
                </div>
                {project.halfsrc && overlayImg(project, token, project.halfsrc, 'half-img')}
            </div>
            {project.imgsrc && overlayImg(project, token, project.imgsrc)}

            {project.type === 'watchtower' ? <>
                <img src='watchtower/watch-info.webp' />
                <video controls>
                    <source src='./watchtower/demovid.mp4'></source>
                </video>
                <div className='blink-container flex-row'>
                    <img src='watchtower/langley-blink.gif' />
                    <img src='watchtower/vera-blink.gif' />
                    <img src='watchtower/samiha-blink.gif' />
                </div>
            </> : null}

            {(project.imgseries || []).map(image => overlayImg(project, token, image))}

            {project.type === 'models' ? <>
                <BlenderModel modelname='/models/ponytail.glb' />
                <BlenderModel modelname='/models/nerd.glb' />
                <BlenderModel modelname='/models/punk.glb' />
            </>
                : null}
        </div>
    )
}

export default NormalOverlay
