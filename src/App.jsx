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
          <div className='flex-row'>
            <div className='keyword'>Product Design @ Artifex Tinkers</div>
            <div className='keyword'>Graphic Design @ The Arbor</div>
          </div>
          <p>I'm a Stanford design student assembling truly fun and interactive visual experiences!</p>
        </div>
        <HoverImg imgsrc='/hero-img.webp' hoveredsrc='/real-me.webp' width={580} height={657} />
      </header>
      <File />
      <Footer />
    </div>
  )
}

export default App
