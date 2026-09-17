import NormalOverlay from './normalOverlay.jsx'
import LockedOverlay from './lockedOverlay.jsx'
import './overlay.css'
import { useEffect } from 'react'

function Overlay({project, setActiveOverlay}) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'auto' }
    }, [])

    return (
        <div className='overlay-bg' onClick={() => setActiveOverlay(null)}>
            {project.locked
                ? <LockedOverlay project={project} setActiveOverlay={setActiveOverlay}/>
                : <NormalOverlay project={project} setActiveOverlay={setActiveOverlay}/>}
        </div>
    )
}

export default Overlay
