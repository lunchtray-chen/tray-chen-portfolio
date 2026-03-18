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
          <h3>Illustrator, UI/UX designer, lover of bad matcha.</h3>
          <div className='flex-row'>
            <div className='keyword'>Incoming @ Arcalink</div>
            <div className='keyword'>Product Design Associate @ QAI</div>
          </div>
          <p>I’m a design student studying at Stanford on how to create truly immersive and memorable visual experiences.</p>
        </div>
        <HoverImg imgsrc='/hero-img.webp' hoveredsrc='/real-me.webp' width={580} height={657} />
      </header>
      <File />
      <Footer />
    </div>
  )
}

export default App
