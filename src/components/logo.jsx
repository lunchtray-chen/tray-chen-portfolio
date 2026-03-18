import './logo.css'

function Logo() {
    return (
        <div className='logo' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo-star.webp" className='logo-star'/>
            <img src="/logo-text.webp" className='logo-text'/>
        </div>
    )
}

export default Logo