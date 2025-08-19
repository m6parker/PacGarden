const bee = document.querySelector('.bee');
const drone = document.querySelector('.drone');
const flowerCount = document.querySelector('.pink-flower-count');
const sunflowerCount = document.querySelector('.sunflower-count');

let pinkflowers = [];
let sunflowers = [];
let pinkcount = 0;
let suncount = 0;
let space = 13;
let questcount = 1;

// get random location inside bounds of the garden
const garden = document.querySelector('.garden');
const gardenPosition = garden.getBoundingClientRect();
function randomSpotInGarden(){
    return Math.random() * 490;
}

// get random location inside bounds of the hive
const hive = document.querySelector('.hive');
const hivePosition = hive.getBoundingClientRect();
function randomSpotInHive(){
    return Math.random() * 190;
}

// plant the items at random
function spawnRandom(quantity, itemType, location){
    if(location === hive){
        while(location.firstChild){ location.removeChild(location.firstChild); }
    }

    for(let i = 0; i < quantity; i++){
        //create flowers
        const item = document.createElement('img');
        item.src = `img/${itemType}.png`;
        item.className = itemType;
        if(itemType === 'bee'){
            item.style.left = `${randomSpotInHive()}px`;
            item.style.top = `${randomSpotInHive()}px`;
        }else{
            item.style.left = `${randomSpotInGarden()}px`;
            item.style.top = `${randomSpotInGarden()}px`;
        }
        //plant them
        if(itemType === 'pinkflower'){
            pinkflowers.push(item);
        }else if(itemType === 'sunflower'){
            sunflowers.push(item);
        }
        location.appendChild(item);
    }
}

// check to see if bee is in the garden or hive
function checkBeeLocation() {
    const bee = document.querySelector('.bee');
    const hive = document.querySelector('.hive');

    const beePosition = bee.getBoundingClientRect();
    const hivePosition = hive.getBoundingClientRect();

    const isInside =
        beePosition.left >= hivePosition.left &&
        beePosition.right <= hivePosition.right &&
        beePosition.top >= hivePosition.top &&
        beePosition.bottom <= hivePosition.bottom;

    if (isInside) {
        console.log('in hive');
    } else {
        console.log('in garden');
    }
}

function checkCollisions(flowerList, flower, index, countType, flowerName){ // maybe also pass in bee position

    const flowerPositionX = parseInt(flower.style.left);
    const flowerPositionY = parseInt(flower.style.top);
    document.querySelector('.space-count').textContent = `space: ${space}`;

    //todo - use variables for sizes later
    if(
        beePositionX < flowerPositionX + 30 &&
        beePositionX + 30 > flowerPositionX &&
        beePositionY < flowerPositionY + 30 &&
        beePositionY + 30 > flowerPositionY
    ){
        flower.remove();
        flowerList.splice(index, 1);
        switch(flowerName){
            case 'Pink Flowers' : {
                pinkcount++;
                space--;
                countType.textContent = `${flowerName}: ${pinkcount}`;
                break;
            };
            case 'Sunflowers' : {
                suncount++;
                space--;
                countType.textContent = `${flowerName}: ${suncount}`;
                break;
            };
        }
        checkQuest(pinkGoal, sunGoal);
    }

}

let beePositionX = 250;
let beePositionY = 250;

//movement
document.addEventListener('keydown', (e) => {
    // todo - check if its within the bounds
    // checck if it collided with wall or door


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
        checkCollisions(pinkflowers, flower, index, flowerCount, 'Pink Flowers');
    });

    sunflowers.forEach((flower, index) => {
        checkCollisions(sunflowers, flower, index, sunflowerCount, 'Sunflowers');
    });

    checkBeeLocation();

});


let pinkGoal;
let sunGoal;
// give a random quest
function createQuest(){
    pinkGoal = Math.floor(Math.random() * 10) + 1;
    sunGoal = Math.floor(Math.random() * 3) + 1;
    document.querySelector('.quest-description').innerHTML = `collect ${pinkGoal} pink flowers and ${sunGoal} sunflowers.`;
    console.log(pinkGoal, sunGoal)
}

// check if quest is fufilled
function checkQuest(pinkGoal, sunGoal){
    if(pinkcount >= pinkGoal && suncount >= sunGoal){
        completeQuest();
    }
}

// win quest
function completeQuest(){
    document.querySelector('.quest-description').innerHTML = 'you win';
    questcount++;
    document.querySelector('.quest-title').innerHTML = `Quest #${questcount}:`;
    createQuest();

}

// ----------------- buttons -------------------

// todo - limit inventory
// drop inventory
const dropButton = document.querySelector('.drop-button');
dropButton.addEventListener('click', () => {
    spawnRandom(pinkcount, 'pinkflower', garden);
    spawnRandom(suncount, 'sunflower', garden);
    pinkcount = 0;
    suncount = 0;
    space = 13;
    document.querySelector('.space-count').textContent = `space: ${space}`;
    flowerCount.textContent = `Pink Flowers: ${suncount}`;
    sunflowerCount.textContent = `Sunflowers: ${suncount}`;
});

// const pauseScreen = document.querySelector('.pause-container');
const pauseButton = document.querySelector('.pause-button');
pauseButton.addEventListener('click', () => {
    // pauseScreen.classList.toggle('hidden');
    stopTimer();
});

// todo - pause banner instead of resume button
// todo - stop all movement
const resumeButton = document.querySelector('.resume-button');
resumeButton.addEventListener('click', () => {
    startTimer();
});


// -------------- start game -------------------

// plant the flowers :)
spawnRandom(10, 'pinkflower', garden);
spawnRandom(3, 'sunflower', garden);
function callSpawn(){
    // put drones in the hive
    spawnRandom(10, 'bee', hive)
}
//bees buzzing
setInterval(callSpawn, 1000);
createQuest();
alert('****** this game is not complete ******')

// ---------------- timer ----------------------

let startTime;
let timerInterval;
let elapsedTime = 0;
const timerDisplay = document.querySelector('.timer');

startTimer();

function formatTime(ms) {
    let date = new Date(ms);
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
}