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
            petalImage.src = 'petal.png'; // Path to your petal image
            petal.appendChild(petalImage);

            // Random horizontal starting position
            petal.style.left = `${Math.random() * 100}vw`;

            // Randomize the rotation and set it as a CSS variable for smooth animation
            const randomRotation = Math.random() * 360; // Random rotation between 0 and 360 degrees
            petal.style.setProperty('--random-rotation', `${randomRotation}deg`); // Apply random rotation via CSS variable

            document.body.appendChild(petal);
            petalsArray.push(petal); // Add the petal to the array

            // Remove the petal after it completes its full fall (9s)
            setTimeout(() => {
                petal.remove();
            }, fallDuration); // Sync removal with animation duration

            // Check if the number of petals exceeds the limit
            if (petalsArray.length > maxPetals) {
                const oldestPetal = petalsArray.shift(); // Remove the oldest petal
                oldestPetal.remove(); // Delete the oldest petal from the DOM
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

        // Slide the letter up at the same time the envelope moves down
        setTimeout(() => {
            letter.classList.add('sliding');

            // After the letter slides up, enlarge it and return the envelope to center
            setTimeout(() => {
                container.classList.add('letter-open');
                letter.classList.add('open');
                body.classList.add('modal-open');
                overlay.classList.add('active');
            }, 800); // Match this with letter sliding duration
        }, 600); // Match this with envelope movement duration
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
