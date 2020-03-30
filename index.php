<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="style.css">
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
                <?php include('hamburger.svg') ?>
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
                    SCRABBLEBAG by <a href="http://jeremy-rose.com" target="_blank">jeremy rose</a>
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
            <div>
                <button type="button" class="changeButton" onclick="undoDraw()">Undo Draw</button>
                <button type="button" class="changeButton" onclick="changeModal()">Change Game</button>
            </div>
        </div>
    </div>

    <div class="welcomeModal">
        <div>
            <h3>Welcome to Scrabblebag!</h3>
            <p>Call a friend on the phone and play!</p>
            <button type="button" class="drawButton" onclick="newGame()">Start a New Game!</button>
            <h4>How to play:</h4>
            <p>Get out your Scrabble board and arrange all the letters face up.</p>
            <p>Whenever it's time to draw, tell the bag how many letters you need and press "Draw." Find the tiles you see on the screen and place them on your rack.</p>
            <p>The rest is up to the players! Each time you make a play, describe it to the other players; they'll use letters from the face-up pool to place your word on their boards.</p>
            <p>Use clear communication, ask questions, and don't violate the honor system! And have fun talking to your friend!</p>
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
            <h3>Are you sure you want to leave this game?</h3>
            <button type="button" onclick="newGame()">Start New Game</button>
            <div>
                <input id="gameId" />
                <button type="button" onclick="goToGame(document.getElementById('gameId').value)">&lt;- or Enter Existing Game ID</button>
            </div>
            <button type="button" onclick="changeModal()">Cancel</button>
        </div>
    </div>
    <div class="tradeModal">
        <div>
            <h3>Which letters would you like to trade in?</h3>
            <input id="tradeLetters" />
            <p>(Type letters separated by a comma. Example: A,Q,X,V)</p>
            <button type="button" onclick="uiTrade()">Trade</button>
            <button type="button" onclick="tradeModal()">Cancel</button>
        </div>
    </div>
</body>
<script src="main.js"></script>
<script>initialize()</script>
</html>