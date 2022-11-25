setTimeout(showEnoruxGame, 2000);

function showEnoruxGame()
{
    document.querySelector("#enoruxGame").classList.add("show");
    init();
    setTimeout(showIntroVideo, 3000);
}

function showIntroVideo()
{
    let time = 4000;

    document.querySelector("#videoWorldCup").play();
    document.querySelector("#enoruxGame").classList.remove("show");
    document.querySelector("#introVideo").classList.add("show");

    setTimeout(showHome, time);
}

function showHome()
{
    document.querySelector("#introVideo").classList.remove("show");
    document.querySelector("#home").classList.add("show");
}

function showChoice()
{
    document.querySelector("#home").classList.remove("show");
    document.querySelector("#choice").classList.add("show");
}

function showSelected()
{
    document.querySelector("#choice").classList.remove("show");
    document.querySelector("#selected").classList.add("show");
}

function showSeePredictions()
{
    document.querySelector("#home").classList.remove("show");
    document.querySelector("#selected").classList.remove("show");
    document.querySelector("#see_predictions").classList.add("show");
}

function showPredictions()
{
    document.querySelector("#see_predictions").classList.remove("show");
    document.querySelector("#predictions").classList.add("show");
}

//
// Clickable functions
//

function nextFromHome()
{
    if (ready)
    {
        if (userChoice.id == null)
        {
            showChoice();
        }
        else
        {
            seePredictions();
        }
    }
}

function nextFromSelected()
{
    seePredictions();
}

async function seePredictions()
{
    showSeePredictions();
    await loadPredictionsData();
    populatePredictions();
}