const bee = document.querySelector('.bee');
const drone = document.querySelector('.drone');
const frog = document.querySelector('.frog');

let beePositionX = 250;
let beePositionY = 250;

let frogPositionX = 100;
let frogPositionY = 100;

let pinkflowers = [];
let sunflowers = [];
let enemies = [];
let pinkcount = 0;
let suncount = 0;

let space = 15;
let questcount = 1;

let health = 2;
let level = 1

// ------------ random stuff ---------------------

// get random location inside bounds of the garden
const garden = document.querySelector('.garden');
const gardenPosition = garden.getBoundingClientRect();
function randomSpotInGarden(){
    return Math.random() * 490;
};

// get random location inside bounds of the hive
const hive = document.querySelector('.hive');
const hivePosition = hive.getBoundingClientRect();
function randomSpotInHive(){
    return Math.random() * 190;
};

// ------------ inventory -------------------------

//create inventory slots
function createInventorySlots(size){
    for(let i = 0; i < size; i++){
        const slot = document.createElement('div');
        slot.className = 'itemSlot';
        slot.classList.add('empty');
        document.querySelector('.inventory').appendChild(slot);
    }
};

// pace in inventory
function addToInventory(itemType){
    const slots = document.querySelectorAll('.itemSlot');
    const item = document.createElement('img');
    item.src = `img/${itemType}.png`;
    item.className = `inv-${itemType}`;
    for(let i = 0; i < slots.length; i++){
        if(slots[i].classList.contains('empty')){
            slots[i].appendChild(item);
            slots[i].classList.remove('empty');
            space--;
            break;
        }
    };
};

//empty inventory
function emptyInventory(item, quantity){
    const slots = document.querySelectorAll('.itemSlot');
    slots.forEach(slot => {
        while(slot.firstChild){ slot.removeChild(slot.firstChild); }
    });

    //all slots usable again
    for(let i = 0; i < slots.length; i++){
        slots[i].classList.add('empty');
    }
};

// ------------ general -------------------------

// plant the items at random
function spawnRandom(quantity, itemType, location){
    // remove old bees to makes it look like their flying around
    if(location === hive){
        while(location.firstChild){ location.removeChild(location.firstChild); }
    }

    for(let i = 0; i < quantity; i++){
        //create item
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
        }else if(itemType === 'frog'){
            enemies.push(item);
        }
        location.appendChild(item);
    }
};

// check to see if bee is in the garden or hive
function checkBeeLocation() {
    const bee = document.querySelector('.bee');
    const hive = document.querySelector('.hive');

    const beePosition = bee.getBoundingClientRect();
    const hivePosition = hive.getBoundingClientRect();

    const isInside =
        beePosition.left   >= hivePosition.left  &&
        beePosition.right  <= hivePosition.right &&
        beePosition.top    >= hivePosition.top   &&
        beePosition.bottom <= hivePosition.bottom;

    if (isInside) {
        console.log('in hive');
    } else {
        console.log('in garden');
    }
    console.log(beePosition.right, beePosition.bottom, beePosition.top);
};

function checkCollisions(flowerList, flower, index, itemName){ // maybe also pass in bee position

    //item positions
    const flowerPositionX = parseInt(flower.style.left);
    const flowerPositionY = parseInt(flower.style.top);

    if(
        space >= 1                           &&
        beePositionX < flowerPositionX + 30  &&
        beePositionX + 30 > flowerPositionX  &&
        beePositionY < flowerPositionY + 30  &&
        beePositionY + 30 > flowerPositionY
    ){
        switch(itemName){
            case 'Pink Flowers' : {
                pinkcount++;
                addToInventory('pinkflower');
                break;
            };
            case 'Sunflowers' : {
                suncount++;
                addToInventory('sunflower');
                break;
            };
            case 'frog' : {
                takeDamage();
                break;
            }
        }
        flower.remove();
        flowerList.splice(index, 1);
        checkQuest(pinkGoal, sunGoal);
    }
};

//touching ememies
function takeDamage(){
    const hearts = document.querySelectorAll('.heart');
    health--; // todo - move this so you dont accidently hit twice
    console.log('health', health)
    if(health === -1){
        document.querySelector('.death-screen').classList.add('show');
    }

    hearts[health+1].src = 'img/heart_empty.png';
    hearts[health+1].classList.add('dead');



    //move frog
    spawnRandom(1, 'frog', garden);

};

//movement
// document.addEventListener('keydown', (e) => {
//     // todo - check if its within the bounds
//     // checck if it collided with wall or door


//     // move the bee ten pixels depending on what key was pressed
//     switch(e.key){
//         case 'ArrowUp':
//             beePositionY -= 10;
//             break;
//         case 'ArrowDown':
//             beePositionY += 10;
//             break;
//         case 'ArrowLeft':
//             beePositionX -= 10;
//             break;
//         case 'ArrowRight':
//             beePositionX += 10;
//             break;
//     }

//     bee.style.left = `${beePositionX}px`;
//     bee.style.top = `${beePositionY}px`;

//     //check collisions with differemt fowers
//     pinkflowers.forEach((flower, index) => {
//         checkCollisions(pinkflowers, flower, index, 'Pink Flowers');
//     });

//     sunflowers.forEach((flower, index) => {
//         checkCollisions(sunflowers, flower, index, 'Sunflowers');
//     });

//     enemies.forEach((enemy, index) => {
//         checkCollisions(enemies, enemy, index, 'frog');
//     });

//     checkBeeLocation();

// });

// ------------ quests -------------------------

let pinkGoal;
let sunGoal;
// give a random quest
function createQuest(){
    pinkGoal = Math.floor(Math.random() * 10) + 1;
    sunGoal = Math.floor(Math.random() * 3) + 1;
    document.querySelector('.quest-description').innerHTML = `collect ${pinkGoal} pink flowers and ${sunGoal} sunflowers.`;
};

// check if quest is fufilled
function checkQuest(pinkGoal, sunGoal){
    if(pinkcount >= pinkGoal && suncount >= sunGoal){
        completeQuest();
    }
};

// win quest
function completeQuest(){
    questcount++;
    level++;
    document.querySelector('.quest-description').innerHTML = 'you win';
    document.querySelector('.quest-title').innerHTML = `Quest #${questcount}:`;
    createQuest();
    spawnRandom(level, 'bee', hive);

    //todo - need better / more obvious win screen
};

// ----------------- buttons -------------------

// todo - limit inventory
// drop inventory
const dropButton = document.querySelector('.drop-button');
dropButton.addEventListener('click', () => {
    emptyInventory();
    spawnRandom(pinkcount, 'pinkflower', garden);
    spawnRandom(suncount, 'sunflower', garden);

    //reset variables
    pinkcount = 0;
    suncount = 0;
    space = 15;
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

// const reloadButton = document.querySelector('.play-button');
// reloadButton.addEventListener('click', () =>{
//     location.reload();
// });

// -------------- start game -------------------

// plant the flowers :)
spawnRandom(10, 'pinkflower', garden);
spawnRandom(3, 'sunflower', garden);
function callSpawn(){
    // put drones in the hive
    spawnRandom(level, 'bee', hive)
};
//bees buzzing
setInterval(callSpawn, 1000);
createQuest();
createInventorySlots(space);
// alert('****** this game is not complete ******')

// place the frog!
spawnRandom(1, 'frog', garden);


// ---------------- canvas ------------------------


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let STATIC_PAGE_WIDTH = window.innerWidth;
let STATIC_PAGE_HEIGHT = window.innerHeight;

const ResizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if(window.innerWidth > STATIC_PAGE_WIDTH){ STATIC_PAGE_WIDTH = window.innerWidth; }
    if(window.innerHeight > STATIC_PAGE_HEIGHT){ STATIC_PAGE_HEIGHT = window.innerHeight; }
};
ResizeCanvas();

window.addEventListener("resize", () => ResizeCanvas());

const hive2 = new Image();
hive2.classList.add('hive');

const bee2 = new Image();
bee2.src = 'img/bee.png';
bee2.style.width = 32;

const mapBackground = new Image();
mapBackground.src = './img/map.png';

let x = 0;
let y = 0;

const speed = 10;

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight'){ x += speed; }
    if(e.key === 'ArrowLeft' ){ x -= speed; }
    if(e.key === 'ArrowUp'   ){ y -= speed; }
    if(e.key === 'ArrowDown' ){ y += speed; }
});
console.log(window.innerWidth, window.innerHeight);

const GAME_INTERVAL = setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas every frame
    context.drawImage(mapBackground, 0, 0, STATIC_PAGE_WIDTH, STATIC_PAGE_HEIGHT); // draw background

    drawHive(100, 100, 100);
    context.drawImage(bee2, x, y);
}, 1000/60);


function drawHive(x, y, radius) {
    context.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        const xPos = x + radius * Math.cos(angle);
        const yPos = y + radius * Math.sin(angle);
        if (i === 0) {
            context.moveTo(xPos, yPos);
        } else {
            context.lineTo(xPos, yPos);
        }
    }
    context.closePath();
    context.stroke();
};

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
};

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);
};

function stopTimer() {
    clearInterval(timerInterval);
};

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
};