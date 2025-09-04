
document.addEventListener('DOMContentLoaded', function() {
  // 1. Partículas (solo si el elemento existe)
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60 },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: { 
          enable: true, 
          distance: 150, 
          color: '#ffffff', 
          opacity: 0.4, 
          width: 1 
        },
        move: { enable: true, speed: 2 }
      },
      interactivity: { detect_on: "canvas", events: { resize: true } }
    });
  }

  // 2. Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // 3. Efectos fade-in
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });
});

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch('https://formsubmit.co/pabloperalta4604@gmail.com', {
      method: 'POST',
      body: formData
    });
    
    if(response.ok) {
      window.location.href = 'gracias.html';
    }
  } catch (error) {
    console.error('Error:', error);
  }
});