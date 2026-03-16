import './file.css'

function tabStatus(activeTab, tabNum) {
    if (activeTab === tabNum) return 'active-tab'
    else if (Math.abs(activeTab - tabNum) === 1) return 'near-tab'
    return 'mid-tab'
}

function FileTab({tabName, activeTab, tabNum, setActiveTab}) {
    return (
        <div className={tabStatus(activeTab, tabNum)}
        onClick={() => setActiveTab(tabNum)}>
            <h3>{tabName}</h3>
        </div>
    )
}

export default FileTab

