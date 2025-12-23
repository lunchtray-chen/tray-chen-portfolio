// code for making elements on website fade in

const faders = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show'); // trigger animation
      obs.unobserve(entry.target); // stop watching after fade-in
      const children = entry.target.querySelectorAll('img');
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.3}s`;
        child.classList.add('show');
      });
    }
  });
}, { threshold: 0.1 });

faders.forEach(fadeEl => observer.observe(fadeEl));

//-------------------------------------------------------------------

// makes the sidebar appear and disappear when clicked

function showSidebar(){
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "inline-block";
}

function hideSidebar(){
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

function showDropdown(){
  const dropdown = document.querySelector(".sidebar .dropdown")
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
  } else {
    dropdown.style.display = "none";
  }
}

//-------------------------------------------------------------------

// Generalizes building repetitive grid html

function buildGrid(grid, desc, filename) {
  if (grid) {
    for (let i = 1; i <= desc.length; i++) {
      grid.insertAdjacentHTML(
        'beforeend',
        `
        <div class="fade-in">
          <img src="images/art-page/${filename}-${i}.webp">
          <h3>${desc[i - 1]}</h3>
        </div>
        `
      );

      const newEl = grid.lastElementChild;
      observer.observe(newEl); 
    }
  }
}

//-------------------------------------------------------------------

// Parts that actualy build the HTML

const watchGallery = document.querySelector('.watch .gallery .two-grid');
const watchImgDesc = [
  "Watchtower's opening screen",
  "Watchtower's settings screen",
  "Initial UI mockup",
  "Final UI design",
  "Turnaround for Avery (deleted character)",
  "Turnaround for Langley",
  "Turnaround for Matthias (deleted character)",
  "Turnaround for Samiha",
  "Turnaround for Vera",
  "Avery design iterations (deleted character)",
  "Environment mockup",
  "Beginning screen initial mockup"
]

buildGrid(watchGallery, watchImgDesc, "watch");

//-------------------------------------------------------------------

// Code that makes the carousel work

const nextButton = document.querySelector(".carousel-button");

nextButton.addEventListener("click", () => {
  const slides = nextButton.closest(".carousel").querySelector("[data-slides]")
  const activeSlide = slides.querySelector("[data-active]")
  let newIndex = [...slides.children].indexOf(activeSlide) + 1
  if (newIndex >= slides.children.length) newIndex = 0

  slides.children[newIndex].dataset.active = true
  delete activeSlide.dataset.active
}) 