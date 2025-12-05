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
