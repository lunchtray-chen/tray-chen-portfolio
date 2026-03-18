import './overlay.css'
import Keyword from './keyword'
import BlenderModel from './blenderModel.jsx'

function NormalOverlay({ project, setActiveOverlay }) {
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
                <img src={project.halfsrc} className='half-img' />
            </div>
            <img src={project.imgsrc} />

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

            {project.imgseries.map(image => (<img key={image} src={image} />))}

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