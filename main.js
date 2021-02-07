let bag; // holds part of API response
let numTiles; // will hold input from keypad
let draw; // holds part of API response
let trade; // holds tiles to trade before confirmation
const api = apiUrl ? `${apiUrl}/api` : ``; // apiUrl from index.php

// define shorthand DOM vars
// burger menu
const burger = document.querySelector('.burger').querySelector('svg');
const gameIdSpan = document.querySelector('.gameId').querySelector('span');
const gameIdTextarea = document.querySelector('.gameId').querySelector('textarea');
// primary screen
const remain = document.querySelector('.remain');
const tileDiv = document.querySelector('.tiles');
const keypad = document.querySelector('.keypad');
const keys = keypad.querySelectorAll('button');
const drawButton = document.getElementById('drawButton');
// draw modal
const drawModalDiv = document.querySelector('.drawModal');
const drawDiv = document.querySelector('.draw');
// trade modal
const tradeModalDiv = document.querySelector('.tradeModal');
const tradeInput = document.querySelector('#tradeLetters')
const tradeConfirmDiv = document.querySelector('.tradeModal .confirm')
const lettersToTrade = tradeConfirmDiv.querySelector('.draw')
// settings modal
const adjusters = document.querySelector('.adjusters');
const showLastDrawButton = document.getElementById('showLatest');
const showLastDraw = document.querySelector('.showLastDraw');
const adjustUndo = document.getElementById('adjustUndo');  
// instructions modal
const instructionsDiv = document.querySelector('.instructionsModal');

// boot game or welcome
const initialize = async () => {
    const wake = await fetch(api)
    if(gameId && await getBag()) {
        drawId();
    } else {
        document.querySelector('.welcomeModal').classList.add('show');
    }
}

// fetch functions
const getBag = async () => {
    try {
        const res = await fetch(`${api}/bag/${gameId}`)
        .then(resp => resp.json())
        .then(resp => resp.bag)
        bag = res;
        drawBag();
        drawRemain();
        return res;
    } catch(error) {
        return false
    }
}

const drawTiles = async (gameId, num) => {
    try {
        const game = await fetch(`${api}/draw/${gameId}/${num}`)
        .then(resp => resp.json())
        .then(resp => resp.game)
        draw = game.draws[game.draws.length-1];
        bag = game.bag;
        drawDraw();
        drawBag();
        drawRemain();
        return game;
    } catch (error) {
        drawModal();
        document.querySelector('.messageModal').querySelector('h3').innerHTML = `Something went wrong!<br>Please close this message and try again.<br> <br>Error details: ${error.message}`;
        messageModal();
    }
}

const undoDraw = async () => {
    const game = await fetch(`${api}/undo/${gameId}`)
    .then(resp => resp.json())
    .then(resp => resp.game)
    draw = [];
    bag = game.bag;
    drawModalDiv.classList.length > 1 ? drawModal() : false;
    drawDraw();
    drawBag();
    drawRemain();
    return game;
}

const goToGame = (gameId) => {
    window.location.replace(`${webRoot}?game=${gameId}`)
}

const tradeIn = async (trade) => {
    console.log('tradeIn running', JSON.stringify(trade));
    const game = await fetch(`${api}/trade/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trade)
    }).then(resp => resp.json())
    .then(resp => resp.game);
    let num = trade.length;
    drawModalDiv.querySelector('div').querySelector('h2').innerHTML = `You traded ${num} tile${num > 1 || num == 0 ? 's' : ''}.<br>Here is your new draw:`;
    draw = game.draws[game.draws.length-1];
    bag = game.bag;
    drawModal();
    drawDraw();
    drawBag();
    drawRemain();
    return game;
}

const newGame = async (e) => {
    let current = e.target.innerHTML;
    e.target.innerHTML = '<img src="images/loading.svg" />';
    const game = await fetch(`${api}/new`)
    .then(resp => resp.json())
    .then(resp => resp.game);
    gameId = game._id;
    bag = game.bag;
    draw = [];
    drawDraw();
    drawBag();
    drawRemain();
    goToGame(gameId);
}

const getSettings = async () => {
    const settings = await fetch(`${api}/adjust/${gameId}`)
    .then(resp => resp.json())
    .then(resp => resp.settings);
    console.log(settings);
    showLastDrawButton.classList.remove('off');
    showLastDraw.innerHTML = '';
    document.querySelector('.changeModal').querySelector('h3').querySelector('span').innerHTML = settings.latestDraws.join(' ');
    draw = settings.latestDraw;
}

// user input functions
const uiDraw = async (e) => {
    let current = e.target.innerHTML;
    let num = numTiles ? numTiles : 0;
    if (num > 0 && num < 8) {
        e.target.innerHTML = '<img src="images/loading.svg" />';
        await drawTiles(gameId, num)
        .then(() => e.target.innerHTML = current);
    } else {
        // prevents showing last draw if draw is zero
        draw = [];
        drawDraw();
    }
    drawModalDiv.querySelector('div').querySelector('h2').innerHTML = `You drew ${num} tile${num > 1 || num == 0 ? 's' : ''}:${num == 0 ? '<br>Please click OK, then select a number between 1 and 7.' : ''}`;
    drawModal();
}

const uiTrade = () => {
    trade = tradeInput.value.match(/[a-zA-Z]/g)
        .map(letter => letterTemplates.filter(template => Object.keys(template)[0] == letter.toUpperCase())[0])
    trade.forEach((letterVal) => {
        let letter = Object.keys(letterVal)[0];
        let tile = document.createElement('div');
        tile.dataset.value = letterVal[letter];
        tile.innerHTML = letter;
        lettersToTrade.appendChild(tile);
    });
    tradeModalDiv.querySelectorAll('.submitTrade button').forEach(button => button.classList.add('off'))
    tradeConfirmDiv.classList.add('show')
}

const uiTradeConfirm = async () => {
    await tradeIn(trade);
    tradeModal();
}

const clipboard = () => {
    const el = document.createElement('textarea');
    console.log(webRoot)
    el.value = `http://jeremy-rose.com/scrabblebag/?game=${gameId}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

const numSelect = (e) => {
    numTiles = Number(e.target.innerHTML);
    keys.forEach(key => key.classList.remove('selected'));
    e.target.classList.add('selected');
}

// modal displayers
const showMenu = () => {
    document.querySelector('.menu').classList.toggle('show');
}

const drawModal = () => {
    drawModalDiv.classList.toggle('show');
}

const changeModal = async () => {
    await getSettings();
    document.querySelector('.changeModal').classList.toggle('show');
    if (bag.length === 100 && adjusters.classList.length < 2) {
        adjusters.classList.add('hide');
    } else if (bag.length != 100 && adjusters.classList.length > 1) {
        adjusters.classList.remove('hide');
    }
    adjustUndo.classList.add('off');
}

const tradeModal = () => {
    tradeModalDiv.classList.toggle('show');
    tradeInput.value = ""
    while (lettersToTrade.firstChild) {
        lettersToTrade.removeChild(lettersToTrade.firstChild);
    }
    tradeConfirmDiv.classList.remove('show')
    tradeModalDiv.querySelectorAll('.submitTrade button').forEach(button => button.classList.remove('off'))
    trade = null
}

const messageModal = () => {
    document.querySelector('.messageModal').classList.toggle('show');
}

const showInstructions = () => {
    instructionsDiv.classList.toggle('show');
}

// DOM writers
const drawId = () => {
    gameIdSpan.innerHTML = gameId;
}

const drawBag = () => {
    tileDiv.innerHTML = '';
    bag.forEach((letterVal) => {
        let letter = Object.keys(letterVal)[0];
        let tile = document.createElement('div');
        tile.dataset.value = letterVal[letter];
        tile.innerHTML = letter;
        tileDiv.appendChild(tile);
    });
}

const drawDraw = () => {
    drawDiv.innerHTML = '';
    draw.forEach((letterVal) => {
        let letter = Object.keys(letterVal)[0];
        let tile = document.createElement('div');
        tile.dataset.value = letterVal[letter];
        tile.innerHTML = letter;
        drawDiv.appendChild(tile);
    });
}

const drawLastDraw = () => {
    draw.forEach((letterVal) => {
        let letter = Object.keys(letterVal)[0];
        let tile = document.createElement('div');
        tile.dataset.value = letterVal[letter];
        tile.innerHTML = letter;
        showLastDraw.appendChild(tile);
    });
    showLastDrawButton.classList.add('off');
    adjustUndo.classList.remove('off');    
}

const drawRemain = () => {
    remain.innerHTML = `<h3>${bag.length}</h3><p>tiles<br>remaining</p>`;
}

// initialize controls
keys.forEach(key => key.addEventListener('click',(e) => numSelect(e))); 
drawButton.addEventListener('click', (e) => uiDraw(e));

adjustUndo.addEventListener('click', () => {
    undoDraw();
    changeModal(); 
})

burger.addEventListener('click',showMenu);

document.querySelector('.welcomeModal').querySelector('.drawButton').addEventListener('click', (e) => newGame(e));
document.querySelector('.settingsNewGame').addEventListener('click', (e) => newGame(e));

// muted/future scripts for game board
// let main = document.querySelector('.board');
// console.log(main);
// for (let i = 1; i <= 15; i++) {
//     for (let j = 1; j <= 15; j++) {
//         let space = document.createElement('div');
//         space.id = `${i}:${j}`;
//         main.appendChild(space);
//     }
// }

// let triple = ['1:1','1:8','1:15','8:1','8:15','15:1','15:8','15:15'];
// triple.forEach(id => document.getElementById(`${id}`).classList.add('triple'));

// let double = ['8:8','2:2','2:14','3:3','3:13','4:4','4:12','5:5','5:11','11:5','11:11','12:4','12:12','13:3','13:13','14:2','14:14'];
// double.forEach(id => document.getElementById(`${id}`).classList.add('double'));

// templates for trade-in tiles
const letterTemplates = [
    {A:1},
    {B:3},
    {C:3},
    {D:2},
    {E:1},
    {F:4},
    {G:2},
    {H:4},
    {I:1},
    {J:8},
    {K:5},
    {L:1},
    {M:3},
    {N:1},
    {O:1},
    {P:3},
    {Q:10},
    {R:1},
    {S:1},
    {T:1},
    {U:1},
    {V:4},
    {W:4},
    {X:8},
    {Y:4},
    {Z:10}
]