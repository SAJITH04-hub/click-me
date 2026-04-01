document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('resButton');
  const secretMessage = document.getElementById('secretMessage');
  const instructionBanner = document.getElementById('instruction');

  let repelDistance = 150;
  let mouse = { x: null, y: null };
  let hasMovedMouse = false;

  
  button.style.display = 'block';
  button.disabled = true;
  button.style.pointerEvents = 'none';

  
  button.setAttribute('tabindex', '-1');

 
  button.addEventListener('keydown', (e) => {
    e.preventDefault();
    return false;
  });

  
  function updateRepelDistance() {
    const rect = button.getBoundingClientRect();
    repelDistance = Math.max(rect.width, rect.height) + 100;
  }

  function randomizeButtonPosition() {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    let randomX, randomY, distanceFromCursor;

    do {
      randomX = Math.random() * (winWidth - button.offsetWidth);
      randomY = Math.random() * (winHeight - button.offsetHeight);

      if (mouse.x === null || mouse.y === null) break;

      distanceFromCursor = Math.hypot(randomX - mouse.x, randomY - mouse.y);
      updateRepelDistance();
    } while (distanceFromCursor < repelDistance);

    if (randomX < 10) randomX = 10;
    if (randomY < 10) randomY = 10;

    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
  }

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (!hasMovedMouse) {
      hasMovedMouse = true;

      
      if (instructionBanner) instructionBanner.remove();

      button.disabled = false;
      button.style.pointerEvents = 'auto';

      randomizeButtonPosition();
    } else {
      const rect = button.getBoundingClientRect();
      const buttonX = rect.left + rect.width / 2;
      const buttonY = rect.top + rect.height / 2;
      const dx = mouse.x - buttonX;
      const dy = mouse.y - buttonY;
      const distance = Math.hypot(dx, dy);

      updateRepelDistance();

      if (distance < repelDistance) {
        const angle = Math.atan2(dy, dx);
        const moveX = -Math.cos(angle) * (repelDistance - distance);
        const moveY = -Math.sin(angle) * (repelDistance - distance);

        let newLeft = rect.left + moveX;
        let newTop = rect.top + moveY;

        const btnWidth = button.offsetWidth;
        const btnHeight = button.offsetHeight;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        if (newLeft < 0) newLeft = winWidth - btnWidth;
        if (newLeft + btnWidth > winWidth) newLeft = 0;
        if (newTop < 0) newTop = winHeight - btnHeight;
        if (newTop + btnHeight > winHeight) newTop = 0;

        button.style.left = `${newLeft}px`;
        button.style.top = `${newTop}px`;
      }
    }
  });

  button.addEventListener('click', async () => {
    try {
      const res = await fetch('/secret-message');
      if (!res.ok) {
        alert('Error fetching secret message: ' + res.statusText);
        return;
      }
      const data = await res.json();
      if (data.message) {
        secretMessage.textContent = data.message;
        secretMessage.style.display = 'block';
      } else {
        alert('Failed to retrieve secret message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. See console for details.');
    }
  });
});
