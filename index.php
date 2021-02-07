<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css?d=04-02">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <script>
            <?php 

            $remote_api = 'https://scrabblebag.herokuapp.com';
            $local_api = 'http://localhost:3000';
            $api = $_SERVER['SERVER_NAME'] == 'localhost' ? $local_api : $remote_api;
            echo "let apiUrl = '$api';
            ";

            $webRoot = $_SERVER['PHP_SELF'];
            echo "let webRoot = '$webRoot';
            ";

            if (isset($_GET['game'])) {
                $game_id = $_GET['game'];
                echo "let gameId = '$game_id';";
            } else {
                echo "let gameId;";
            }
            ?>
        </script>
    </head>
<body>
    <!-- <div class="board">
    </div> -->
    <div class="info">
        <div class="infoHeader">
            <div class="burger">
                <?php include('images/hamburger.svg') ?>
            </div>
            <div class="menu">
                <div class="gameId">
                    Current Game ID:
                    <br>
                    <span></span>
                </div>
                <div>
                    <button type="button" onclick="clipboard()">Copy Link to Clipboard</button>
                </div>
                <div>
                    <button type="button" onclick="showInstructions()">Game Instructions</button>
                </div>
                <div class="contact">
                    SCRABBLEBAG by <a href="http://jeremy-rose.com" target="_blank">jeremy rose</a><br> <br>
                    <a href="https://github.com/jeremyrrose/scrabblebag" target="_blank">View code on GitHub</a>
                </div>
            </div>
        </div>
        <div class="bag">
            <div>
                <p class="remain"></p>
            </div>
            <div class="tiles"></div>
        </div>
    </div>
    <div class="controls">
        <div class="controlsNum">
            <h5># of tiles to draw</h5>
            <div class="keypad">
                <button type="button" class="key">1</button>
                <button type="button" class="key">2</button>
                <button type="button" class="key">3</button>
                <button type="button" class="key">4</button>
                <button type="button" class="key">5</button>
                <button type="button" class="key">6</button>
                <button type="button" class="key">7</button>
                <button type="button" class="trade" onclick="tradeModal()">Trade</button>
            </div>
        </div>
        <div class="buttons">
            <button type="button" class="drawButton" id="drawButton">Draw</button>
            <button type="button" class="changeButton" onclick="changeModal()"><div>Adjust Game</div><img src="images/settings.svg"></button>
        </div>
    </div>

    <div class="welcomeModal">
        <div>
            <h3>Welcome to Scrabblebag!</h3>
            <p>Call a friend on the phone and play!</p>
            <button type="button" class="drawButton">Start a New Game!</button>
            <h4>How to play:</h4>
            <p>Get out your Scrabble board and arrange all the letters face up.</p>
            <p>Start a new game and text or email the URL in the address bar to your friend. Whenever it's time to draw, tell the bag how many letters you need and press "Draw." Find the tiles you see on the screen and place them on your rack.</p>
            <p>The rest is up to the players! Each time you make a play, describe it to the other players; they'll use letters from the face-up pool to place your word on their boards.</p>
            <p>Use clear communication, ask questions, and don't violate the honor system! And have fun talking to your friends!</p>
            <p onclick="showInstructions()" style="cursor: pointer; font-weight: bold; color: green;">View step-by-step instructions here.</p>
        </div>
    </div>
    <div class="drawModal">
        <div>
            <h2></h2>
            <div class="draw"></div>
            <div class="buttons">
                <button type="button" class="changeButton" onclick="undoDraw()">Undo Draw</button>
                <button type="button" class="drawButton" onclick="drawModal()">OK</button>
            </div>
        </div>
    </div>
    <div class="changeModal">
        <div>
            <div class="adjusters">
                <h2>Adjust this game:</h2>

                <h3>Most recent draws (number of tiles): <span></span></h3>
                <div class="showLastDraw">
                </div>
                <div class="adjusterButtons">
                    <button type="button" id="showLatest" onclick="drawLastDraw()">Show Latest Draw</button>
                    <button type="button" id="adjustUndo" class="off">Undo Draw</button>
                </div>
            </div>

            <h2>Leave this game:</h2>
            <button type="button" class="settingsNewGame">Start New Game</button>
            <div>
                <input id="gameId" />
                <button type="button" onclick="goToGame(document.getElementById('gameId').value)">...or Enter a Game ID</button>
            </div>
            <button type="button" class="return" onclick="changeModal()">Return to Game</button>
        </div>
    </div>
    <div class="tradeModal">
        <div class="submitTrade">
            <h3>Which letters would you like to trade in?</h3>
            <input id="tradeLetters" />
            <button type="button" class="tradeConfirm" onclick="uiTrade()">Trade</button>
            <button type="button" onclick="tradeModal()">Cancel</button>
        </div>
        <div class="confirm">
            <h2>You entered:</h2>
            <div class="draw"></div>
            <div class="buttons">
                <button type="button" class="tradeConfirm" onclick="uiTradeConfirm()">Trade</button>
                <button type="button" onclick="tradeModal()">Cancel</button>
            </div>
        </div>
    </div>
    <div class="instructionsModal">
        <div class="instructionsHeader">
            <div class="title">
                <h2>How to play</h2>
                <div onclick="showInstructions()"> <img src="images/exit.svg"> </div>
            </div>
            <!-- <div class="instructionsMenu">
                <span>Step By Step</span> | <span>Frequently Asked Questions</span>
            </div> -->
        </div>
        <div class="stepByStep">
            <h3>Step by step:</h3>
            <p><span>1.</span> Call a friend (or several friends) via speakerphone or video call. Set up a Scrabble board in each location and arrange all letter tiles face up.</p> 
            <p><span>2.</span> Start a new game in this app.</p>
            <p><span>3.</span> Copy the URL in your browser's address bar -- it will start with "http://jeremy-rose.com/scrabblebag" -- and text or email it to all players. (Players can view the bag on their smartphones or computers.)</p> 
            <p><span>4.</span> To draw, select the number of tiles and press "Draw." Your new tiles will be displayed.</p>
            <p><span>5.</span> Pick your designated letters from the face-up tiles, then click "OK." If you chose the wrong number of tiles, just click "Undo Draw" and try again. (Don't cheat!)</p>
            <p><span>6.</span> When it's your turn, place your word on your board. Then tell your fellow players where you placed it.</p>
            <p><span>7.</span> When other players make a play, listen carefully. Use tiles from the face-up pool to place their words on your board in the correct place.</p>
            <p><span>8.</span> Have fun!</p>
        </div>
        <div class="FAQ">
            <h3>Frequently Asked Questions</h3>
            <h4>How do I keep score?</h4>
            <p>Keep score just as you would in a normal Scrabble game. Each player can keep a scoresheet in their location, or one designated scorekeeper can keep everyone updated.</p>
            <h4>What happens if there's a mistake?</h4>
            <p>All players should draw only the letters selected for them by the app, but still, mistakes can happen if players add an incorrect tile to their rack or accidentally undo a valid draw. Players may notice a letter or two out of place at the very end of the game, so we suggest letting all players play with the letters they <i>think</i> they're supposed to have -- resolve any discrepancies by adding a placeholder tile on your board if necessary. This isn't a tournament game!</p>
            <h4>Can I pause my game?</h4>
            <p>Yes. There's no time limit, and you can come back to your game at any time by visiting the same address, including the long ID at the end. (Copy, paste, and email it to yourself to remember.)</p>
            <h4>What if my friends cheat?</h4>
            <p>You should expect better behavior from them!</p>
            <h4>I just noticed a mistake that was made several draws earlier. Can I fix it?</h4>
            <p>Well, it might be more fun to simply proceed with your game and use a placeholder tile for duplicates. If you insist on correcting a mistake, the "Adjust Game" menu allows you to see only the most recent draw. If you undo that draw, you can see the previous draw, and so on -- but all players would need to place every tile from these draws back in the face-up pool, and the game would need to be restarted from that point. We recommend moving forward instead!</p>
        </div>
    </div>
    <div class="messageModal">
        <h3></h3>
        <button type="button" onclick="messageModal()">Close</button>
    </div>
</body>
<script src="main.js?d=04-02"></script>
<script>initialize()</script>
</html>