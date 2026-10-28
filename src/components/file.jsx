import './file.css'
import FileTab from './fileTab';
import FilePage from './filePage';
import Overlay from './overlay';
import { useState, useEffect } from 'react';
import { designProjects, artProjects } from './projectData';

const TAB_NAME_TO_NUM = { projects: 0, artworks: 1, about: 2 };
const TAB_NUM_TO_NAME = { 0: 'projects', 1: 'artworks', 2: 'about' };
const PROJECTS_BY_TAB = { 0: designProjects, 1: artProjects };

/* "#projects/cloverknots" -> { tab: 0, slug: 'cloverknots' } */
function parseHash(defaultTabNum) {
  const [tabName, slug] = window.location.hash.replace('#', '').split('/');
  return { tab: TAB_NAME_TO_NUM[tabName] ?? defaultTabNum, slug: slug || null };
}

/*
 * The tab and the open project both live in the hash, so a copied link reopens the same
 * overlay. Opening a project pushes a history entry (flagged in history.state) so Back
 * closes it; closing pops that entry, or, for a link someone landed on directly, just
 * rewrites the hash so Back still leaves the site.
 */
function useNavFromURL(defaultTabNum) {
  const [nav, setNav] = useState(() => parseHash(defaultTabNum));

  useEffect(() => {
    const sync = () => setNav(parseHash(defaultTabNum));
    // pushState doesn't fire hashchange, but Back/Forward over those entries fires popstate
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [defaultTabNum]);

  const setActiveTab = (tabNum) => {
    window.location.hash = TAB_NUM_TO_NAME[tabNum] ?? tabNum;
  };

  const setActiveOverlay = (project) => {
    const tabName = TAB_NUM_TO_NAME[nav.tab];
    if (project) {
      history.pushState({ overlay: true }, '', `#${tabName}/${project.slug}`);
    } else if (history.state?.overlay) {
      history.back();
      return;
    } else {
      history.replaceState(null, '', `#${tabName}`);
    }
    setNav(parseHash(defaultTabNum));
  };

  const activeOverlay = nav.slug
    ? PROJECTS_BY_TAB[nav.tab]?.find(project => project.slug === nav.slug) ?? null
    : null;

  return { activeTab: nav.tab, setActiveTab, activeOverlay, setActiveOverlay };
}

function File() {
    const { activeTab, setActiveTab, activeOverlay, setActiveOverlay } = useNavFromURL(0);

    return (
        <main className='main-content'>
            {activeOverlay != null && <Overlay key={activeOverlay.slug} project={activeOverlay} setActiveOverlay={setActiveOverlay} />}
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