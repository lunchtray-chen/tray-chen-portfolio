import './file.css'
import FileTab from './fileTab';
import FilePage from './filePage';
import Overlay from './overlay';
import { useState } from 'react';

function File() {
    const [activeTab, setActiveTab] = useState(0)
    const [activeOverlay, setActiveOverlay] = useState(null)

    return (
        <main className='main-content'>
            {activeOverlay != null && <Overlay project={activeOverlay} setActiveOverlay={setActiveOverlay} />}
            <div className='tab-bar flex-row'>
                <FileTab tabName="Projects" tabNum={0} activeTab={activeTab} setActiveTab={setActiveTab} />
                <FileTab tabName="Artworks" tabNum={1} activeTab={activeTab} setActiveTab={setActiveTab} />
                <FileTab tabName="About Me" tabNum={2} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className='file-content'>
                <FilePage activeTab={activeTab} setActiveOverlay={setActiveOverlay} />
            </div>
            <div className='tab-bar flex-row' id='foot-tabs'>
                <FileTab tabName="Projects" tabNum={0} activeTab={activeTab} setActiveTab={setActiveTab} />
                <FileTab tabName="Artworks" tabNum={1} activeTab={activeTab} setActiveTab={setActiveTab} />
                <FileTab tabName="About Me" tabNum={2} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </main>
    )
}

export default File