import './projectCard.css'
import Keyword from './keyword'
import HoverImg from './hoverImg'

function ProjectCard({project, setActiveOverlay}) {
    return (
        <div className='project-card flex-col'>
            <HoverImg imgsrc={project.imgsrc} hoveredsrc={project.hoveredsrc} 
            onClick={() => setActiveOverlay(project)}/>
            <h3 onClick={() => setActiveOverlay(project)}>{project.name}</h3>
            <Keyword keywords={project.keywords} />
            <p>{project.description}</p>
        </div>
    )
}

export default ProjectCard