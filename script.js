const garden = document.querySelector('.garden-map');
const bee = document.querySelector('.bee');
const flowerCount = document.querySelector('.pink-flower-count');
const sunflowerCount = document.querySelector('.sunflower-count');
let pinkflowers = [];
let sunflowers = [];
let pinkcount = 0;
let suncount = 0;

// plant the flowers in the garden
function plantFlowers(quantity, flowerType){
    for(let i = 0; i < quantity; i++){
        const flower = document.createElement('img');
        flower.src = `img/${flowerType}.png`;
        flower.className = flowerType;
        flower.style.left = `${Math.random() * 500}px`;
        flower.style.top = `${Math.random() * 500}px`;
        garden.appendChild(flower);
        if(flowerType === 'pinkflower'){
            pinkflowers.push(flower);
        }else if(flowerType === 'sunflower'){
            sunflowers.push(flower);
        }
    }
}

function checkCollisions(flowerList, flower, index, countType, flowerName, count){
    console.log(count);

    const flowerPositionX = parseInt(flower.style.left);
    const flowerPositionY = parseInt(flower.style.top);

    if(
        beePositionX < flowerPositionX + 20 &&
        beePositionX + 30 > flowerPositionX &&
        beePositionY < flowerPositionY + 20 &&
        beePositionY + 30 > flowerPositionY
    ){
        flower.remove();
        flowerList.splice(index, 1);
        count++;
        countType.textContent = `${flowerName}: ${count}`;
    }
}

let beePositionX = 250;
let beePositionY = 250;

//movement
document.addEventListener('keydown', (e) => {
    // move the bee ten pixels depending on what key was pressed
    switch(e.key){
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

    //check collisions with differemt fowers
    pinkflowers.forEach((flower, index) => {
        checkCollisions(pinkflowers, flower, index, flowerCount, 'Pink Flowers', pinkcount);
    });

    sunflowers.forEach((flower, index) => {
        checkCollisions(sunflowers, flower, index, sunflowerCount, 'Sunflowers', suncount);
    });

});

plantFlowers(10, 'pinkflower');
plantFlowers(3, 'sunflower');