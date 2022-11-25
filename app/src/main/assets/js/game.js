let levelInfo;
let life = 1;
let goalWay;
let startPosX;
let startPosY;
let posX;
let posY;
let game = document.querySelector("#game");
let gameCopy;
let teleporterEnabled = false;
let counter;
let currentCell;
let counterStart
let time;
let currentTime;
let endGame = false;
let isWinGame = false;
let lastMove = -1;

document.querySelector("#up").addEventListener('click', up, false);
document.querySelector("#down").addEventListener('click', down, false);
document.querySelector("#left").addEventListener('click', left, false);
document.querySelector("#right").addEventListener('click', right, false);

function up(e)
{
    if (!e.target.classList.contains("lock"))
    {
        currentCell.textContent = "";
        posY--;
        lastMove = 0;
        update();
    }
}

function down(e)
{
    if (!e.target.classList.contains("lock"))
    {
        currentCell.textContent = "";
        posY++;
        lastMove = 1;
        update();
    }
}

function left(e)
{
    if (!e.target.classList.contains("lock"))
    {
        currentCell.textContent = "";
        posX--;
        lastMove = 2;
        update();
    }
}

function right(e)
{
    if (!e.target.classList.contains("lock"))
    {
        currentCell.textContent = "";
        posX++;
        lastMove = 3;
        update();
    }
}

function enableKeyboard() //TODO remove
{
    document.addEventListener('keydown', keyboardMove, false);
}

function disableKeyboard() //TODO remove
{
    document.removeEventListener('keydown', keyboardMove, false);
}

function keyboardMove(event) //TODO remove
{
    switch (event.key)
    {
        case "ArrowUp" :
            up({"target": document.querySelector("#up")});
            break;
        case "ArrowLeft" :
            left({"target": document.querySelector("#left")});
            break;
        case "ArrowDown" :
            down({"target": document.querySelector("#down")});
            break;
        case "ArrowRight" :
            right({"target": document.querySelector("#right")})
    }
}

function teleport(event)
{
    game.rows[posY].cells[posX].textContent = "";
    posX = event.target.cellIndex;
    posY = event.target.parentNode.rowIndex;
    console.log("ok");
    document.querySelectorAll(".teleporter").forEach((teleporter) =>
    {
        teleporter.removeEventListener("click", teleport);
        teleporter.classList.remove("expand");
    });
    update();
}

function calculate()
{
    if (endGame)
    {
        return;
    }

    currentCell = game.rows[posY].cells[posX];

    currentCell.textContent = "•";

    if (currentCell.classList.contains("teleporter"))
    {
        teleporterEnabled = true;
        document.querySelectorAll(".teleporter").forEach((teleporter) =>
        {
            teleporter.addEventListener('click', teleport, false);
            teleporter.classList.add("expand");
        });
        return;
    }
    if (teleporterEnabled)
    {
        teleporterEnabled = false;
        document.querySelectorAll(".teleporter").forEach((teleporter) =>
        {
            teleporter.removeEventListener("click", teleport);
            teleporter.classList.remove("expand");
        });
    }

    if (currentCell.classList.contains("way"))
    {
        document.querySelectorAll(".life:not(.lost)")[life - 1]?.classList.add("lost");
        life--;

        if (life <= 0)
        {
            loseGame();
            return;
        }
        resetGame();
        return;
    }

    currentCell.classList.remove("moveBottomToTop");
    currentCell.classList.remove("moveTopToBottom");
    currentCell.classList.remove("moveRightToLeft");
    currentCell.classList.remove("moveLeftToRight");

    switch (lastMove)
    {
        case 0:
            currentCell.classList.add("moveBottomToTop");
            break;
        case 1 :
            currentCell.classList.add("moveTopToBottom");
            break;
        case 2 :
            currentCell.classList.add("moveRightToLeft");
            break
        case 3 :
            currentCell.classList.add("moveLeftToRight");
    }

    if (currentCell.classList.contains("doubleWay"))
    {
        currentCell.classList.remove("doubleWay");
        return;
    }
    if (currentCell.classList.contains("tripleWay"))
    {
        currentCell.classList.remove("tripleWay");
        currentCell.classList.add("doubleWay");
        return;
    }

    currentCell.classList.add("way");

    if (game.querySelectorAll('.way').length === goalWay)
    {
        winGame();
    }
}

function update()
{
    calculate();
    if (!endGame)
    {
        updateMoves();
    }
}

function startCounter()
{
    counterStart = Date.now();
    document.getElementById('counter').textContent = time;
    counter = window.setInterval(function ()
    {
        currentTime = time - ((Date.now() - counterStart) / 1000);
        let remaining = Math.round(currentTime);
        document.getElementById('counter').textContent = remaining;
        if (remaining <= 0)
        {
            update();
        }
    }, 1000);
}

function resumeCounter()
{
    counterStart = Date.now() - ((time - currentTime) * 1000);
    counter = window.setInterval(function ()
    {
        currentTime = time - ((Date.now() - counterStart) / 1000);
        let remaining = Math.round(currentTime);
        document.getElementById('counter').textContent = remaining;
        if (remaining <= 0)
        {
            update();
        }
    }, 50);
}

function stopCounter()
{
    clearInterval(counter);
}

function clearCounter()
{
    document.getElementById('counter').textContent = "";
}

function resetCounter()
{
    stopCounter();
    clearCounter();
    startCounter();
}

function resetGame()
{
    game.innerHTML = gameCopy;
    posX = startPosX;
    posY = startPosY;

    update();
    resetCounter();
}

function updateMoves()
{
    console.log("update moves");
    if (game.querySelectorAll("tr")[posY - 1]?.querySelectorAll("td")[posX]?.classList.contains("wall") || posY - 1 < 0)
    {
        document.querySelector("#up").classList.add("lock");
    }
    else
    {
        document.querySelector("#up").classList.remove("lock");
    }
    if (game.querySelectorAll("tr")[posY + 1]?.querySelectorAll("td")[posX]?.classList.contains("wall") || posY + 1 > game.rows.length - 1)
    {
        document.querySelector("#down").classList.add("lock");
    }
    else
    {
        document.querySelector("#down").classList.remove("lock");
    }
    if (game.querySelectorAll("tr")[posY]?.querySelectorAll("td")[posX - 1]?.classList.contains("wall") || posX - 1 < 0)
    {
        document.querySelector("#left").classList.add("lock");
    }
    else
    {
        document.querySelector("#left").classList.remove("lock");
    }
    if (game.querySelectorAll("tr")[posY]?.querySelectorAll("td")[posX + 1]?.classList.contains("wall") || posX + 1 > game.rows[0].cells.length - 1)
    {
        document.querySelector("#right").classList.add("lock");
    }
    else
    {
        document.querySelector("#right").classList.remove("lock");
    }
}

function lockMoves()
{
    console.log("lock moves");
    document.querySelector("#up").classList.add("lock");
    document.querySelector("#down").classList.add("lock");
    document.querySelector("#left").classList.add("lock");
    document.querySelector("#right").classList.add("lock");
}

function extractLevel(levelInfo_)
{
    levelInfo = levelInfo_;
    let cellsAmount = 0;
    game.innerHTML = "";

    levelInfo.lines.forEach((line) =>
    {
        let tr = document.createElement("tr");
        line.forEach((cell) =>
        {
            let td = document.createElement("td");
            if (cell !== "wall" && cell !== "teleporter")
            {
                cellsAmount++;
            }
            if (cell !== '' && cell !== 'way')
            {
                td.classList.add(cell);
            }
            tr.appendChild(td);
        })

        game.appendChild(tr);
    })

    startPosX = levelInfo.startPos.x;
    startPosY = levelInfo.startPos.y;
    posX = levelInfo.startPos.x;
    posY = levelInfo.startPos.y;
    time = levelInfo.time;
    goalWay = cellsAmount;
    gameCopy = game.innerHTML;
    setLife(2);
    attemptAmountForAd++;
}

function setLife(amount)
{
    life = amount;
    document.querySelectorAll(".life").forEach((life_, key) =>
    {
        if (key < life)
        {
            life_.classList.remove("lost");
        }
        else
        {
            life_.classList.add("lost");
        }
    });

}

function initGame()
{
    update();
    enableKeyboard();
    startCounter();
}

function stopGame()
{
    stopCounter();
    lockMoves();
    disableKeyboard();
}

function winGame()
{
    endGame = true;
    isWinGame = true;
    stopGame();
    console.log("win " + document.getElementById('counter').textContent + "s");
    sendResultLevel(document.getElementById('counter').textContent);
}

function loseGame()
{
    endGame = true;
    stopGame();
    console.log("lose " + document.getElementById('counter').textContent + "s");
    sendResultLevel(0);
}

function showGameResult(res)
{
    console.log(res);
    if (isWinGame)
    {
        document.querySelector("#gameResultBox").classList.add("gameWin");
        document.querySelector("#gameResultBox").classList.remove("gameLose");
    }
    else
    {
        document.querySelector("#gameResultBox").classList.add("gameLose");
        document.querySelector("#gameResultBox").classList.remove("gameWin");
    }
    if (res.points >= 0)
    {
        document.querySelector("#resultPoints").textContent = "+ " + res.points;
        if (res.points > 0)
        {
            levelPassAmountForAd++;
        }
    }
    else
    {
        document.querySelector("#resultPoints").textContent = "- " + Math.abs(res.points);
    }
    document.querySelector("#gameResult").classList.add("show");
    isWinGame = false;
}

function attemptBackToLevels()
{
    if (!endGame)
    {
        stopCounter();
        document.querySelector("#confirmBackToLevels").classList.add("show");
        document.querySelector("#game").classList.add("hideGame");
    }
}

function cancelAttemptBackToLevels()
{
    resumeCounter();
    document.querySelector("#confirmBackToLevels").classList.remove("show");
    document.querySelector("#game").classList.remove("hideGame");
}

function backToLevels()
{
    sendResultLevel(0);
    document.querySelector("#confirmBackToLevels").classList.remove("show");
}

function quitGame()
{
    evaluateShowAd();
    endGame = false;
    stopGame();
    clearCounter();
    loadUserLevelsData(mod);
    document.querySelector("#gameResult").classList.remove("show");
    document.querySelector("#levels").classList.add("show");
    document.querySelector("#menu").classList.add("show");
    document.querySelector("#game").classList.remove("hideGame");
    document.querySelector("#gameBox").classList.remove("show");
}