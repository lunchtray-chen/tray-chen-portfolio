import './file.css'
import ProjectCard from './projectCard.jsx'

function PageGrid({projectType, setActiveOverlay}) {
    return (
        <div className='page-grid'>
            {projectType.map(project => (
                <ProjectCard 
                key={project.name}
                project={project}
                setActiveOverlay={setActiveOverlay}
                />
            ))}
        </div>
    )
}

export default PageGrid