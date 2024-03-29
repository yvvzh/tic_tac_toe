document.addEventListener("DOMContentLoaded", () => {
    const slctBtn = document.querySelector(".slider");
    const tiles = document.getElementsByClassName("tiles");
    const tilesCollection = [...tiles];
    const themeDisplay = document.querySelector(".start-game");

    const themesCross = ["bxl-visual-studio", "bxl-bing", "bx-x-circle", "bxs-sun"];
    const themesCircle = ["bxl-github", "bxl-opera", "bx-check-circle", "bxs-moon"];

    const winPatterns = [
        ["a1", "a2", "a3"],
        ["b1", "b2", "b3"],
        ["c1", "c2", "c3"],
        ["a1", "b1", "c1"],
        ["a2", "b2", "c2"],
        ["a3", "b3", "c3"],
        ["a1", "b2", "c3"],
        ["c1", "b2", "a3"],
    ];

    let iconCross;
    let iconCircle;
    let gameTurn = 0;
    let currentPlayer = "X";
    let filledTiles = [];
    let playerXtiles = [];
    let playerOtiles = [];
    let gameStatus = 0;
    let playerMode = 0;
    let possibilities = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];

    handleDialog("start");
    displayThemes();

    function displayThemes() {
        // active l'écoute du switch
        slctBtn.addEventListener("click", () => {
            playerMode = playerMode === 0 ? 1 : 0;
        });
        //afficher les thèmes
        for (let i = 0; i < themesCross.length; i++) {
            const div = document.createElement("div");
            div.classList.add("themes");
            div.id = `theme${i}`;
            const cross = document.createElement("i");
            cross.classList.add("bx", themesCross[i]);
            const circle = document.createElement("i");
            circle.classList.add("bx", themesCircle[i]);
            div.appendChild(cross);
            div.appendChild(circle);
            div.addEventListener("click", () => {
                handleSettings(themesCross[i], themesCircle[i]);
            });
            themeDisplay.appendChild(div);
        }

        //afficher le thème aléatoire
        let random = Math.floor(Math.random() * themesCross.length);
        const div = document.createElement("div");
        div.classList.add("themes");
        div.id = `theme-random`;
        const cross = document.createElement("i");
        cross.classList.add("bx", themesCross[random]);
        const randomThemeCross = themesCross[random];

        random = Math.floor(Math.random() * themesCross.length);
        const circle = document.createElement("i");
        circle.classList.add("bx", themesCircle[random]);
        const randomThemeCircle = themesCircle[random];
        div.appendChild(cross);
        div.appendChild(circle);
        div.addEventListener("click", () => {
            handleSettings(randomThemeCross, randomThemeCircle);
        });
        themeDisplay.appendChild(div);
    }

    function handleSettings(cross, circle) {
        iconCross = cross;
        iconCircle = circle;
        startGame();
    }

    function handleDialog(status) {
        const dialog = document.getElementById("dialog");
        switch (status) {
            case "start":
                dialog.textContent = "Choisissez votre adversaire et un thème.";
                break;
            case "playerXturn":
                dialog.textContent = "Tour du joueur X.";
                break;
            case "playerOturn":
                dialog.textContent = "Tour du joueur O.";
                break;
            case "computerTurn":
                dialog.textContent = "Tour de l'ordinateur.";
                break;
            case "computerWins":
                dialog.textContent = "L'ordinateur gagne la partie!";
                break;
            case "already filled":
                dialog.textContent = "La case est déjà prise.";
                break;
            case "playerXwins":
                dialog.textContent = "Joueur X gagne la partie!";
                break;
            case "playerOwins":
                dialog.textContent = "Joueur O gagne la partie!";
                break;
            case "draw":
                dialog.textContent = "Match nul...";
                break;
        }
    }

    function handleClickCPU(tileID) {
        if (gameStatus === 0) {
            if (filledTiles.includes(tileID)) {
                handleDialog("already filled");
            } else {
                filledTiles.push(tileID);
                const tile = document.getElementById(tileID);
                tile.classList.add("filled-tiles");
                resolveTurn(tileID, iconCross, playerXtiles);
                if (gameStatus === 0) {
                    currentPlayer = "O";
                    handleDialog("computerTurn");
                    computerLogic();
                }
            }
        }
    }

    function computerLogic() {
        // Déclare la variable choix de l'ordinateur
        let computerMove;

        // Analyse des choix disponibles
        let availableMoves = possibilities.filter((move) => !filledTiles.includes(move));

        // Règle 1: Vérifie si l'ordi peut gagner
        for (let move of availableMoves) {
            playerOtiles.push(move); // Simule le placement
            if (checkWin(playerOtiles)) {
                playerOtiles.pop(); // Retire le placement simulé
                computerMove = move;
                break;
            }
            playerOtiles.pop(); // Retire le placement simulé
        }

        // Règle 2: Vérifie si l'adversaire peut gagner et le bloque
        if (!computerMove) {
            for (let move of availableMoves) {
                playerXtiles.push(move); // Simule le placement de l'adversaire
                if (checkWin(playerXtiles)) {
                    playerXtiles.pop(); // Retire le placement de l'adversaire
                    computerMove = move;
                    break;
                }
                playerXtiles.pop(); // Retire le placement de l'adversaire
            }
        }

        // Règle 3: Vérifie si l'ordi peut occuper la case centrale
        if (!computerMove && availableMoves.includes("b2")) {
            computerMove = "b2";
        }

        // Règle 4: Joue par aléatoirement par défaut
        if (!computerMove) {
            let randomIndex = Math.floor(Math.random() * availableMoves.length);
            computerMove = availableMoves[randomIndex];
        }
        setTimeout(() => {
            // Simule un temps de réflexion
            computerTurn(computerMove);
        }, 500);
    }

    function checkWin(playerTiles) {
        for (let pattern of winPatterns) {
            let count = 0;
            for (let tile of pattern) {
                if (playerTiles.includes(tile)) {
                    count++;
                }
            }
            if (count === 3) {
                return true; // Player has won
            }
        }
        return false; // Player has not won
    }

    function computerTurn(computerMove) {
        if (gameStatus === 0) {
            if (filledTiles.includes(computerMove)) {
                alert("computer move generation is wrong");
            } else {
                filledTiles.push(computerMove);
                const tile = document.getElementById(computerMove);
                tile.classList.add("filled-tiles");
                resolveTurn(computerMove, iconCircle, playerOtiles);
                if (gameStatus === 0) {
                    currentPlayer = "X";
                    handleDialog("playerXturn");
                }
            }
        }
    }

    function handleClick2P(tileID) {
        if (gameStatus === 0) {
            if (filledTiles.includes(tileID)) {
                handleDialog("already filled");
            } else {
                filledTiles.push(tileID);
                const tile = document.getElementById(tileID);
                tile.classList.add("filled-tiles");
                switch (currentPlayer) {
                    case "X":
                        resolveTurn(tileID, iconCross, playerXtiles);
                        if (gameStatus === 0) {
                            currentPlayer = "O";
                            handleDialog("playerOturn");
                        }
                        break;
                    case "O":
                        resolveTurn(tileID, iconCircle, playerOtiles);
                        if (gameStatus === 0) {
                            currentPlayer = "X";
                            handleDialog("playerXturn");
                        }
                        break;
                }
            }
        }
    }

    function resolveTurn(tileID, playerIcon, playerList) {
        gameTurn++;
        const icon = document.createElement("i");
        icon.classList.add("bx", playerIcon);
        const currentTile = document.getElementById(tileID);
        currentTile.appendChild(icon);
        playerList.push(tileID);
        if (gameTurn >= 5) {
            resolveGame();
        }
    }

    function resolveGame() {
        winPatterns.forEach((pattern) => {
            let X = 0;
            let O = 0;
            pattern.forEach((element) => {
                if (playerXtiles.includes(element)) {
                    X++;
                } else if (playerOtiles.includes(element)) {
                    O++;
                }

                if (X === 3) {
                    handleDialog("playerXwins");
                    gameStatus++;
                    endGame();
                } else if (O === 3) {
                    switch (playerMode) {
                        case 0:
                            handleDialog("computerWins");
                            gameStatus++;
                            endGame();
                            break;
                        case 1:
                            handleDialog("playerOwins");
                            gameStatus++;
                            endGame();
                            break;
                    }
                }
            });
        });

        if (gameTurn >= 9 && gameStatus === 0) {
            handleDialog("draw");
            gameStatus++;
            endGame();
        }
    }

    function startGame() {
        const container = document.querySelector(".container");
        container.classList.remove("blur-mask");

        themeDisplay.classList.add("hidden");

        switch (playerMode) {
            case 0:
                tilesCollection.forEach((tile) => {
                    tile.addEventListener("click", () => {
                        if (gameTurn % 2 === 0) {
                            const tileID = tile.id;
                            handleClickCPU(tileID);
                        }
                    });
                });
                break;
            case 1:
                tilesCollection.forEach((tile) => {
                    tile.addEventListener("click", () => {
                        const tileID = tile.id;
                        handleClick2P(tileID);
                    });
                });
                break;
        }
        handleDialog("playerXturn");
    }

    function endGame() {
        tilesCollection.forEach((tile) => {
            tile.classList.add("filled-tiles");
        });

        // add blur to grid
        const container = document.querySelector(".container");
        container.classList.add("blur-mask");

        // remove hidden from mask
        const mask = document.querySelector(".end-game");
        mask.classList.remove("hidden");

        // add event listener to replay icon
        const replayBtn = document.getElementById("replay");
        replayBtn.addEventListener("click", () => {
            location.reload();
        });
    }
});
