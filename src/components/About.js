// src/components/About.js
import React from 'react';
import '../App.css';

// Import images
import cozyNooki from '../assets/images/cozy_nooki_112.png';
import firedUpNooki from '../assets/images/fired_up_nooki_112.png';
import rossImage from '../assets/images/ross.png';
import pokebitmapImage from '../assets/images/GYKkcIrXUAAVJPI.jpg';
import samSageImage from '../assets/images/Screenshot_2023-11-13_033705.png';

const About = () => {
  return (
    <div className="about-container">
      <header className="header">
        <h1></h1>
      </header>
      <main className="about-content">
   

        {/* Add Image Section */}
        <div className="about-images">
          <img src={cozyNooki} alt="Cozy Nooki" className="about-image" />
          <img src={firedUpNooki} alt="Fired Up Nooki" className="about-image" />
        </div>

        {/* Description Section */}
        <div className="about-description">
         <h2>The Legend of Ordinooki</h2>
<p>
In the realm of the Bitcoin blockchain, a new species has emerged—small, mystical creatures known as Ordinookis, based on the ancient tales of tanukis, shapeshifting tricksters that test human character. With a supply of only 2,907, their presence is limited, finite, and legendary. These mischievous beings represent more than just digital collectibles; they are a test of patience, trust, and participation in the Bitcoin ecosystem.
</p>
<p>
On November 11, 2023, a remarkable event occurred: a free mint unlike any other, designed by three key figures in the Bitcoin community—Pokebitmap, CtrlRoss, and Sam Sage. Together, they crafted an experience that would change the way people interact with Bitcoin mints. This wasn't just a launch; it was an experiment of art, technology, and community engagement.
</p>
<p>
Pokebitmap, the mastermind behind the back end, ensured that the Ordinookis would be easy to access, mintable in our own website with a One Click Mint Function using XVERSE API. He collaborated with Xverse to create a one-of-a-kind, single-click minting process, simplifying what had traditionally been a complex operation. Through this innovation, anyone could participate without barriers, just by clicking a button and receiving a randomly generated Ordinooki.
</p>
<p>
Meanwhile, CtrlRoss, the visionary artist, he not only made the traits live in spaces he also considered people yelling out traits to create at the spot. He brought life to the Ordinookis in real-time. In the midst of Twitter Spaces, Ross drew these magical creatures live, interacting with the community and allowing them to suggest traits for their future Ordinookis. Each drawing was unique, shaped by the community, making every mint a collaborative effort and embedding the voices of the Bitcoin ecosystem into the DNA of each Ordinooki.
</p>
<p>
And then, there was Sam Sage—the driving force who ensured everything came together seamlessly, overseeing the smooth execution of this groundbreaking project. Together, they opened the door to the world of Ordinookis, allowing collectors to adopt their own creatures through Magic Eden, using Bitcoin as their ticket into this whimsical world.
</p>
<p>
But there's one golden rule to this lore: don't buy an Ordinooki. These creatures aren't simply to be acquired; they are to be embraced, forming a bond between the owner and the mystical tanuki-inspired beings.
</p>
</div>

        {/* Team Section */}
        <div className="team-section">
          <h2>Meet The Team</h2>
          <div className="team-container">
            {/* Team Member 1: CtrlRoss */}
            <div className="team-member">
              <a href="https://x.com/ctrlRoss" target="_blank" rel="noopener noreferrer">
                <img src={rossImage} alt="Ross" className="team-member-image" />
              </a>
              <p>Ross (The Artist)</p>
            </div>

            {/* Team Member 2: Pokebitmap */}
            <div className="team-member">
              <a href="https://x.com/pokebitmap" target="_blank" rel="noopener noreferrer">
                <img src={pokebitmapImage} alt="Pokebitmap" className="team-member-image" />
              </a>
              <p>Pokebitmap (Full Stack Developer)</p>
            </div>

            {/* Team Member 3: Sam Sage */}
            <div className="team-member">
              <a href="https://x.com/SamSageWize" target="_blank" rel="noopener noreferrer">
                <img src={samSageImage} alt="Sam Sage" className="team-member-image" />
              </a>
              <p>Sam Sage (Front End Dev/Indexer)</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Ordinooki. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
