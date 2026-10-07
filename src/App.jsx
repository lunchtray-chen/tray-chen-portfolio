import './index.css'
import Logo from './components/logo.jsx'
import File from './components/file.jsx'
import HoverImg from './components/hoverImg.jsx'
import NavBar from './components/navbar.jsx'
import Footer from './components/footer.jsx'

function App() {
  return (
    <div className='portfolio'>
      <NavBar />
      <Logo />
      <header className='intro'>
        <div className='intro-text flex-col'>
          <h1>Tray Chen!</h1>
          {/*<div className='flex-row'>
            <div className='keyword'>Graphic Design @ The Arbor</div>
            <div className='keyword'>Formerly Product Design @ Artifex Tinkers</div>
          </div>*/}
          <p>I'm a Stanford design student assembling truly fun and interactive visual experiences! 
            Currently working for Stanford's Arbor Live; previously a designer at Artifex Tinkers.</p>
          <p>I'm currently looking for product design, illustration, and UI/UX roles. Let's chat!</p>
        </div>
        <HoverImg imgsrc='/hero-img.webp' hoveredsrc='/real-me.webp' width={580} height={657} />
      </header>
      <File />
      <Footer />
    </div>
  )
}

export default App
