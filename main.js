let bag;
let numTiles;
let draw;
let api = apiUrl ? `${apiUrl}/api` : ``;

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

const initialize = async () => {
    if(gameId) {
        getBag();
        drawId();
    } else {
        document.querySelector('.welcomeModal').classList.add('show');
    }
}

const getBag = async () => {
    const res = await fetch(`${api}/bag/${gameId}`)
    .then(resp => resp.json())
    .then(resp => resp.bag)
    bag = res;
    drawBag();
    drawRemain();
    return res;
}

const drawTiles = async (gameId, num) => {
    const game = await fetch(`${api}/draw/${gameId}/${num}`)
    .then(resp => resp.json())
    .then(resp => resp.game)
    draw = game.draws[game.draws.length-1];
    bag = game.bag;
    drawDraw();
    drawBag();
    drawRemain();
    return game;
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

const uiDraw = async (e) => {
    let current = e.target.innerHTML;
    let num = numTiles ? numTiles : 0;
    if (num > 0 && num < 8) {
        e.target.innerHTML = '<img src="loading.svg" />';
        await drawTiles(gameId, num)
        .then(() => e.target.innerHTML = current);
    }
    drawModalDiv.querySelector('div').querySelector('h2').innerHTML = `You drew ${num} tile${num > 1 || num == 0 ? 's' : ''}:${num == 0 ? '<br>Please click OK, then select a number between 1 and 7.' : ''}`;
    drawModal();
}

const uiTrade = () => {
    let letters = document.getElementById('tradeLetters').value.split(',');
    tradeIn(letters);
    tradeModal();
}

const goToGame = (gameId) => {
    window.location.replace(`${webRoot}?game=${gameId}`)
}

const tradeIn = async (letters) => {
    let trade = letters.map(letter => letterTemplates.filter(template => Object.keys(template)[0] == letter.toUpperCase())[0])
    console.log(JSON.stringify(trade));
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

const newGame = async () => {
    const game = await fetch(`${api}/new`)
    .then(resp => resp.json())
    .then(resp => resp.game)
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

let burger = document.querySelector('.burger').querySelector('svg');
let gameIdSpan = document.querySelector('.gameId').querySelector('span');
let gameIdTextarea = document.querySelector('.gameId').querySelector('textarea');
let tileDiv = document.querySelector('.tiles');
let drawModalDiv = document.querySelector('.drawModal');
let adjusters = document.querySelector('.adjusters');
let showLastDrawButton = document.getElementById('showLatest');
let showLastDraw = document.querySelector('.showLastDraw');
let adjustUndo = document.getElementById('adjustUndo');    
let loadModal = document.querySelector('.loadModal');
let drawDiv = document.querySelector('.draw');
let remain = document.querySelector('.remain');
let keypad = document.querySelector('.keypad');
let keys = keypad.querySelectorAll('button');
let drawButton = document.getElementById('drawButton');

keys.forEach(key => key.addEventListener('click',(e) => numSelect(e))); 

drawButton.addEventListener('click', (e) => uiDraw(e));

adjustUndo.addEventListener('click', () => {
    undoDraw();
    changeModal(); 
})

const showMenu = () => {
    document.querySelector('.menu').classList.toggle('show');
}

burger.addEventListener('click',showMenu);

const clipboard = () => {
    const el = document.createElement('textarea');
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
    document.querySelector('.tradeModal').classList.toggle('show');
}

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