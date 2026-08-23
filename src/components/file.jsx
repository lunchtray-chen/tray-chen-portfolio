import './file.css'
import FileTab from './fileTab';
import FilePage from './filePage';
import Overlay from './overlay';
import { useState, useEffect } from 'react';

const TAB_NAME_TO_NUM = { projects: 0, artworks: 1, about: 2 };
const TAB_NUM_TO_NAME = { 0: 'projects', 1: 'artworks', 2: 'about' };

function useActiveTabFromURL(defaultTabNum) {
  const [activeTab, setActiveTabState] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return TAB_NAME_TO_NUM[hash] ?? defaultTabNum;
  });

  const setActiveTab = (tabNum) => {
    setActiveTabState(tabNum);
    window.location.hash = TAB_NUM_TO_NAME[tabNum] ?? tabNum;
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTabState(TAB_NAME_TO_NUM[hash] ?? defaultTabNum);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [defaultTabNum]);

  return [activeTab, setActiveTab];
}

function File() {
    const [activeTab, setActiveTab] = useActiveTabFromURL(0);
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