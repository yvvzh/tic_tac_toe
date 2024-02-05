document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.getElementsByClassName("tiles");
    const tilesCollection = [...tiles];
    const iconCircle = "bxl-github";
    const iconCross = "bxl-visual-studio";

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

    let gameTurn = 0;
    let currentPlayer = "X";
    let filledTiles = [];
    let playerXtiles = [];
    let playerOtiles = [];
    let gameStatus = 0;

    tilesCollection.forEach((tile) => {
        tile.addEventListener("click", () => {
            const tileID = tile.id;
            handleClick(tileID);
        });
    });

    handleDialog("playerXturn");

    function handleDialog(status) {
        const dialog = document.getElementById("dialog");
        switch (status) {
            case "playerXturn":
                dialog.textContent = "Tour du joueur X.";
                break;
            case "playerOturn":
                dialog.textContent = "Tour du joueur O.";
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

    function handleClick(tileID) {
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
        resolveGame();
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
                    lockTiles();
                } else if (O === 3) {
                    handleDialog("playerOwins");
                    gameStatus++;
                    lockTiles();
                }
            });
        });

        if (gameTurn >= 9 && gameStatus === 0) {
            handleDialog("draw");
            gameStatus++;
            lockTiles();
        }
    }

    function lockTiles() {
        tilesCollection.forEach((tile) => {
            tile.classList.add("filled-tiles");
        });

        // add blur to grid
        const container = document.querySelector(".container");
        container.classList.add("blur-mask");

        // remove hidden from mask
        const mask = document.querySelector(".mask");
        mask.classList.remove("hidden");

        // add event listener to replay icon
        const replayBtn = document.getElementById("replay");
        replayBtn.addEventListener("click", () => {
            location.reload();
        });
    }
});
