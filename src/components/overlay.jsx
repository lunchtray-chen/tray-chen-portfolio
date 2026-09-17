import NormalOverlay from './normalOverlay.jsx'
import LockedOverlay from './lockedOverlay.jsx'
import './overlay.css'
import { useEffect } from 'react'

function Overlay({project, setActiveOverlay}) {
    useEffect(() => {
        // hiding the scrollbar widens the page, which slides the right-anchored layout
        // sideways — replace its width with padding so nothing moves
        const scrollbar = window.innerWidth - document.documentElement.clientWidth
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${scrollbar}px`
        return () => {
            document.body.style.overflow = 'auto'
            document.body.style.paddingRight = ''
        }
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
