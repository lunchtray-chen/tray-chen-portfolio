import './projectCard.css'

function HoverImg({imgsrc, hoveredsrc, width, height, onClick}) {

    return (
        <div className='hover-container' onClick={onClick}>
            <img src={imgsrc} width={width} height={height}/>
            <img src={hoveredsrc} width={width} height={height}/>
        </div>
        
    )
}

export default HoverImg

