import './file.css'
import './projectCard.css'
import { useState } from 'react';

const wordImgs = {
    'Multidiciplinary': '/about-me/multi.webp',
    'A Poet': '/about-me/poet.webp',
    'Always Making Things': '/about-me/making.webp',
    'A Lover Of My Friends': '/about-me/friend.webp',
    'An Artist!!': '/about-me/artist.webp',
    'Lin-Manuel Miranda': '/about-me/lin.webp',
    'Going On Side Quests': '/about-me/side.webp',
}

const words = Object.keys(wordImgs)

function AboutPage() {
    const [activeWord, setActiveWord] = useState('Multidiciplinary')

    return (
        <div className='flex-col'>
            <div className='pic-zone flex-row'>
                <div className='selectbox'>
                    <h2>I am:</h2>
                    <div className='selectwords'>
                        {words.map(word => (<div
                            className={word === activeWord ? 'keyword' : 'unselected'}
                            key={word}
                            onClick={() => { setActiveWord(word) }}>
                            {word}
                        </div>))}
                    </div>
                </div>
                {(activeWord) ? <img src={wordImgs[activeWord]} width={500} /> : <img src='/real-me.webp' width={500} />}
            </div>
            <h2>About me!!</h2>
            <p>Hi! I’m Tray (they/them) and I’m a design student at Stanford who’s
                been drawing for nearly a decade. I'm mainly a designer and artist, but 
                I also love 3D modeling, writing, crocheting, and game development.
                I'm a member of Stanford's Storyboard Club and Modern Music Ensemble
                 (as a live artist/poetry reciter, unfortunately I can't play an instrument.)
                 I'm always looking for creative opportunities, so please contact me
                 if you have a project in mind! </p><br/>
            <h3>Contact me at: gtchen2@stanford.edu</h3>
        </div>
    )
}

export default AboutPage

