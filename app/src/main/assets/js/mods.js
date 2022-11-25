let modList = document.querySelector("#modsList").querySelectorAll(".mod-item");
let currentMod = 0;

function changeModLeft()
{
    if(modList[currentMod - 1] === undefined)
    {
        document.querySelector("#modsList").style.left = (-1 * (modList.length - 1 ) * (20)) + "vw";
        currentMod = modList.length - 1;
        return;
    }
    currentMod = currentMod - 1;

    document.querySelector("#modsList").style.left = (-1 * currentMod * (20)) + "vw";
}


function changeModRight()
{
    if(modList[currentMod + 1] === undefined)
    {
        document.querySelector("#modsList").style.left = "0";
        currentMod = 0;
        return;
    }
    currentMod = currentMod + 1;
    document.querySelector("#modsList").style.left = (-1 * currentMod * (20)) + "vw";
}