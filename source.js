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
}, { threshold: 0.25 });

faders.forEach(fadeEl => observer.observe(fadeEl));

function showSidebar(){
  const sidebar = document.querySelector(".sidebar")
  sidebar.style.display = "inline-block"
}
function hideSidebar(){
  const sidebar = document.querySelector(".sidebar")
  sidebar.style.display = "none"
}
function showDropdown(){
  const dropdown = document.querySelector(".sidebar .dropdown")
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "inline-block";
  } else {
    dropdown.style.display = "none";
  }
}