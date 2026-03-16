import './file.css'
import PageGrid from './pageGrid'
import AboutPage from './aboutPage';
import { designProjects, artProjects } from './projectData'

function FilePage({activeTab, setActiveOverlay}) {
    return (
        <div className='file-page'>
            {activeTab === 0 && <div>
                <h2>Design Projects</h2>
                <p>Larger UI/UX and product design projects completed professionally or for class. 
                    Includes branding, web design, data management, and more.</p>
                <PageGrid projectType={designProjects} setActiveOverlay={setActiveOverlay}/>
            </div>}
            {activeTab === 1 && <div>
                <h2>2D/3D Artworks</h2>
                <p>Creative personal projects I complete on my own time.</p>
                <PageGrid projectType={artProjects} setActiveOverlay={setActiveOverlay}/>
            </div>}
            {activeTab === 2 && <div>
                <AboutPage/>
            </div>}
        </div>
    )
}

export default FilePage