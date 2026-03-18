import './projectCard.css'

const keywordColors = {
    'Professional': 'var(--red)',
    'Freelance': 'var(--pink)',
    'Classwork': 'var(--orange',
    'Personal': 'var(--pink)',

    'Branding': 'var(--indigo)',
    'UI/UX': 'var(--blue)',
    'Game Dev': 'var(--cyan)',
    'Product Design': 'var(--indigo)',
    'Graphic Design': 'var(--greenblue)', 
    'Illustration': 'var(--blue)'
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

