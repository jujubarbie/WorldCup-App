let lockPlayButton = false;

setTimeout(showEnoruxGame, 2000);

function showEnoruxGame()
{
    document.querySelector("#enoruxGame").classList.add("show");
    playCreepyMusic();
    // setTimeout(showCompetitionEdition, 4000);
    setTimeout(showCompetitionEdition, 100);
}

function showCompetitionEdition()
{
    document.querySelector("#enoruxGame").classList.remove("show");
    document.querySelector("#competitionEdition").classList.add("show");
    playCreepyMusic();
    // setTimeout(showTheBest, 4000);
    setTimeout(showTheBest, 100);
}

function showTheBest()
{
    let time = 100;

    document.querySelector("#videoTheBest").play();
    document.querySelector("#competitionEdition").classList.remove("show");

    document.querySelector("#theBest").classList.add("show");

    if(!confidentiality)
    {
        setTimeout(showConfidentiality, time);
    }
    else if(typeof facebook.logged == "undefined")
    {
        setTimeout(showConnectionMenu, time);
    }
    else
    {
        setTimeout(showLoading, time);
    }
}

function showConfidentiality()
{
    document.querySelector("#theBest").classList.remove("show");
    document.querySelector("#confidentiality").classList.add("show");

    // if(typeof facebook.logged == "undefined")
    // {
    //     setTimeout(showConnectionMenu, time);
    // }
    // else
    // {
    //     setTimeout(showLoading, time);
    // }
}

function showConnectionMenu()
{
    document.querySelector("#theBest").classList.remove("show");
    document.querySelector("#connectionMenu").classList.add("show");
}

function showLoading()
{
    document.querySelector("#theBest").classList.remove("show");
    document.querySelector("#loading").classList.add("show");

    init();

    // setTimeout(showHome, 4000);
}

function showHomeVideo()
{
    document.querySelector("#home_video_").play();
    document.querySelector("#home_video").classList.add("show");
    setTimeout(showHome, 4000);
}

function showHome()
{
    // playHomeMusic();
    document.querySelector("#loading").classList.remove("show");
    document.querySelector("#home").classList.add("show");
    document.querySelector("#menu").classList.add("show");
    setTimeout(hideHomeVideo, 1000);
}

function hideHomeVideo()
{
    document.querySelector("#home_video").classList.remove("show");
    document.querySelector("#home_video_").currentTime = 0;
}

function showModVideo()
{
    if (lockPlayButton)
    {
        console.log("locked mod !");
        return;
    }
    document.querySelector("#mod_video_").play();
    document.querySelector("#mod_video").classList.add("show");
    lockPlayButton = true;
    setTimeout(showMods, 4000);
}

function showMods()
{
    document.querySelector("#home").classList.remove("show");
    document.querySelector("#mods").classList.add("show");
    setTimeout(hideModVideo, 1000);
    setMenuHome();
    playChooseModMusic();
}

function hideModVideo()
{
    document.querySelector("#mod_video").classList.remove("show");
    document.querySelector("#mod_video_").currentTime = 0;
}

function showLevels(mod)
{
    loadUserLevelsData(mod);
    document.querySelector("#mods").classList.remove("show");
    document.querySelector("#levels").classList.add("show");
}

async function showVideo1(level_id)
{
    document.querySelector("#game_video1_").play();
    document.querySelector("#game_video1").classList.add("show");

    if (!(await loadLevel(level_id)))
    {
        document.querySelector("#menu").classList.add("show");
        document.querySelector("#levels").classList.add("show");
        document.querySelector("#game_video1").classList.remove("show");
        showLevels(mod);
        return;
    }

    setTimeout(toGameTransition1, 1500);
}

function toGameTransition1()
{
    document.querySelector("#menu").classList.remove("show");
    document.querySelector("#levels").classList.remove("show");

    setTimeout(toGameTransition2, 1000);
}

function toGameTransition2()
{
    document.querySelector("#gameBox").classList.add("show");

    setTimeout(showGame, 2000);
}

function showGame()
{
    document.querySelector("#game_video1").classList.remove("show");
    document.querySelector("#menu").classList.remove("show");
    document.querySelector("#gameBox").classList.add("show");
    initGame();
}

function showBackHomeVideo()
{
    if (lockPlayButton)
    {
        return;
    }
    document.querySelector("#back_home_video_").play();
    document.querySelector("#back_home_video").classList.add("show");
    lockPlayButton = true;
    setTimeout(backHome, 4000);
}

function backHome()
{
    playHomeMusic();
    loadHomeData();
    document.querySelector("#mods").classList.remove("show");
    document.querySelector("#levels").classList.remove("show");
    document.querySelector("#home").classList.add("show");
    setMenuPlay();
    setTimeout(hideBackHomeVideo, 1000);
}

function hideBackHomeVideo()
{
    document.querySelector("#back_home_video").classList.remove("show");
    document.querySelector("#back_home_video_").currentTime = 0;
}

function setMenuHome()
{
    document.querySelector("#menu_play_box").classList.add("hide");
    document.querySelector("#menu_home_box").classList.remove("hide");
    lockPlayButton = false;
}

function setMenuPlay()
{
    document.querySelector("#menu_home_box").classList.add("hide");
    document.querySelector("#menu_play_box").classList.remove("hide");
    lockPlayButton = false;
}

function showFB()
{
    let url = 'https://www.facebook.com/v14.0/dialog/oauth?' +
            'client_id=610014044014083' +
            '&redirect_uri=https://www.google.com' +
            '&state={test=noki}';
    // window.open(url, '_blank').focus();
    // window.location.href = url;
    // document.querySelector("#fb").classList.add("show");
    // document.querySelector("#fb_src").src = url;
    loginFB();
}

function hideFB()
{
    document.querySelector("#fb").classList.remove("show");
}