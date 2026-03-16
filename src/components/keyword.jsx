import './projectCard.css'

const keywordColors = {
    'Professional': 'var(--red)',
    'Branding': 'var(--green)',
    'UI/UX': 'var(--blue)',
    'Game Dev': 'var(--red)',
    'Concept Art': 'var(--orange)',
    'Product Design': 'var(--indigo)',
    'Graphic Design': 'var(--greenblue)', 
    'Illustration': 'var(--red)'
}

function determineColor(keyword) {
    return keywordColors[keyword] || 'var(--blue)'
}

function Keyword({keywords}) {
    return (
        <div className='keywords flex-row'>
            {keywords.map(word => (<span 
            className='keyword' 
            key={word} 
            style={{ backgroundColor: determineColor(word) }}>
                {word}
            </span>))}
        </div>
    )
}

export default Keyword

