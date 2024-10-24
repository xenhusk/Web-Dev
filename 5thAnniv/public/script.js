// Hide preloader when page is fully loaded
window.addEventListener('load', function() {
    // Simulate a minimum loading time of 1.5 seconds
    setTimeout(function() {
        const preloader = document.getElementById('preloader');
        const mainContent = document.getElementById('main-content');
        
        // Add fade-out class to preloader
        preloader.classList.add('fade-out');
        
        // Show main content
        mainContent.style.display = 'block';
        
        // Remove preloader from DOM after animation
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }, 4000);
});

const body = document.body;
const container = document.querySelector('.container');
const letter = document.querySelector('.letter');
const overlay = document.querySelector('.overlay');
let isOpen = false;

        // Maximum number of petals allowed on screen
        const maxPetals = 30; 
        const petalsArray = []; // Store the currently active petals
        const fallDuration = 9000; // 9s fall duration, matching the animation time

        // Function to create a petal element
        function createPetal() {
            const petal = document.createElement('div');
            petal.classList.add('petal');

            // Add the petal image inside the div
            const petalImage = document.createElement('img');
            petalImage.src = 'petal.png';
            petal.appendChild(petalImage);

            // Random horizontal starting position within 95% of the viewport width to avoid edge overflow
            const viewportWidth = window.innerWidth;
            const randomLeft = Math.random() * (viewportWidth * 0.95); // Limit left position to 95% of the screen width
            petal.style.left = `${randomLeft}px`;

            // Randomize the rotation and set it as a CSS variable for smooth animation
            const randomRotation = Math.random() * 360;
            petal.style.setProperty('--random-rotation', `${randomRotation}deg`);

            document.body.appendChild(petal);
            petalsArray.push(petal);

            // Remove the petal after it completes its full fall (9s)
            setTimeout(() => {
                petal.remove();
            }, fallDuration);

            // Check if the number of petals exceeds the limit
            if (petalsArray.length > maxPetals) {
                const oldestPetal = petalsArray.shift();
                oldestPetal.remove();
            }
        }
        // Create multiple petals at an interval
        setInterval(createPetal, 500); // Adjust interval for how often petals are created
        function openEnvelope(envelope) {
            if (!isOpen) {
                isOpen = true;
        
                // Move envelope down and start letter animation
                container.classList.add('open');
                envelope.classList.add('open');
                eruptHearts();
                setTimeout(() => {
                    letter.classList.add('sliding');
                    setTimeout(() => {
                        container.classList.add('letter-open');
                        letter.classList.add('open');
                        body.classList.add('modal-open');
                        overlay.classList.add('active');
                        
                        // Start heart eruption after the letter opens        
                    }, 800);
                }, 600);
            }
        }
        
        function createHeart() {
            const heart = document.createElement('div');
            heart.classList.add('heart');
        
            // Add the heart SVG as innerHTML
            heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="30px" height="30px"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        
            // Random initial position near the envelope's center
            const randomOffsetX = (Math.random() - 0.5) * 200;
            const randomOffsetY = (Math.random() - 0.5) * 100;
            heart.style.left = `calc(50% + ${randomOffsetX}px)`;
            heart.style.top = `calc(50% + ${randomOffsetY}px)`;
        
            // Append the heart to the body
            document.body.appendChild(heart);
        
            // Randomize heart's flight trajectory (left, right, or straight up)
            const randomAngle = (Math.random() - 0.5) * 60; // Tilt left or right by up to 30 degrees
            const randomScale = 0.5 + Math.random() * 1.5; // Random size scaling for variety
            heart.style.setProperty('--random-angle', `${randomAngle}deg`);
            heart.style.setProperty('--random-scale', randomScale);
        
            // Remove heart after the eruption and settling animation completes
            setTimeout(() => {
                heart.remove();
            }, 4000); // Adjust timing to match eruption and settling duration
        }
        
        function eruptHearts() {
            for (let i = 0; i < 30; i++) {
                setTimeout(createHeart, i * 100); // Stagger heart creation for eruption effect
            }
        }        

// Click outside to close the animation in reverse
overlay.addEventListener('click', () => {
    if (isOpen) {
        isOpen = false;
        letter.classList.remove('open');
        body.classList.remove('modal-open');
        overlay.classList.remove('active');

        // Wait for letter to shrink before sliding back
        setTimeout(() => {
            letter.classList.remove('sliding');
            container.classList.remove('letter-open');
            container.classList.remove('open');

            // Reset envelope
            setTimeout(() => {
                document.querySelector('.envelope').classList.remove('open');
            }, 600);
        }, 600);
    }
});
