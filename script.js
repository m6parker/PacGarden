const garden = document.querySelector('.garden');
const bee = document.querySelector('.bee');
const flowerCount = document.querySelector('.flower-count');
let flowers = [];

// plant the flowers in the garden
function plantFlowers(quantity){
    for(let i = 0; i < quantity; i++){
        const flower = document.createElement('img');
        flower.src = 'img/pink_flower.png';
        flower.className = 'flower';
        flower.style.left = `${Math.random() * 500}px`;
        flower.style.top = `${Math.random() * 500}px`;
        garden.appendChild(flower);
        flowers.push(flower);
    }
}

let beePositionX = 180;
let beePositionY = 180;
let score = 0;
//movement
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            beePositionY -= 10;
            break;
        case 'ArrowDown':
            beePositionY += 10;
            break;
        case 'ArrowLeft':
            beePositionX -= 10;
            break;
        case 'ArrowRight':
            beePositionX += 10;
            break;
    }

    bee.style.left = `${beePositionX}px`;
    bee.style.top = `${beePositionY}px`;

});

plantFlowers(10);