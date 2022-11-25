/* ############################################################### */
/* ########################### MUSIC ############################# */

/* ############################################################### */

function playHomeMusic()
{
    playMusic("audio/music/???.mp3")
}

function playChooseModMusic()
{
    playMusic("audio/music/choose-mod.mp3");
}

/* ############################################################### */
/* ########################## SOUNDS ############################# */

/* ############################################################### */

function playCreepyMusic()
{
    playSound("audio/music/creepy.mp3");
}

/* ############################################################### */
/* ########################## HANDLER ############################ */
/* ############################################################### */

let music = document.querySelector("#audio_music");
let audio = [];
audio[0] = document.querySelector("#audio0");
audio[1] = document.querySelector("#audio1");
audio[2] = document.querySelector("#audio2");
audio[3] = document.querySelector("#audio3");

function playMusic(src)
{
    music.pause();
    music.src = src;
    music.loop = true;
    music.play();
}

function playSound(src)
{
    let availableAudio = getAvailableAudio();
    availableAudio.src = "audio/music/creepy.mp3";
    availableAudio.loop = false;
    availableAudio.play();
}

function getAvailableAudio()
{
    for (let i = 0; i < audio.length; i++)
    {
        if (audio[i].paused)
        {
            return audio[i];
        }
    }

    console.log("Error : not enough audio channel");
}

function pauseMusic()
{
    music.pause();
}

function playPausedMusic()
{
    music.play();
}

function replayMusic()
{
    music.pause();
    music.currentTime = 0;
    music.play();
}