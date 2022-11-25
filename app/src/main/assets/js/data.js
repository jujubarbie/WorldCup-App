let uuid = "test"; //TODO change before launch
let SECRET_ID = "enorux"; //TODO change before launch
let mod;
let level_id;
let isAdMobReady = true; //TODO change before launch
let isInterstitialAdReady = false;
let noAdCanBeLoad = false;
let attemptAmountForAd = 0;
let levelPassAmountForAd = 0;
let facebook = {};
let confidentiality = true;

// function justATest()
// {
//    window.AndroidBridge.myMethod(returnSomething());
// }

function returnSomething()
{
    return "something";
}

function setUUID(uuid_)
{
    uuid = uuid_;
    // document.querySelector("#test").innerHTML = "UUID : " + uuid_;
}

function setAdMobReady(value)
{
    isAdMobReady = value;
    document.querySelector("#test").innerHTML = "isAdMobReady : " + isAdMobReady;
}

function setInterstitialAdReady(value)
{
    isInterstitialAdReady = value;
    document.querySelector("#test").innerHTML = "isInterstitialAdReady : " + isAdMobReady;
}

function setNoAdCanBeLoad(value)
{
    noAdCanBeLoad = value;
    document.querySelector("#test").innerHTML = "noAdCanBeLoad : " + isAdMobReady;
}

function displayWhatever(value)
{
    document.querySelector("#test2").innerHTML = "" + value;
}

function onAdFinish()
{
    setTimeout(function ()
    {
        document.querySelector("#test2").innerHTML = "ok gros !";
    }, 1000);
}

function evaluateShowAd()
{
    if (attemptAmountForAd >= 3)
    {
        showAd();
        attemptAmountForAd = 0;
        levelPassAmountForAd = 0;
        return;
    }

    if (levelPassAmountForAd >= 2)
    {
        showAd();
        attemptAmountForAd = 0;
        levelPassAmountForAd = 0;
    }
}

function showAd()
{
    try
    {
        window.AndroidBridge.showAd();
    } catch (e)
    {

    }
}

function loginFB()
{
    try
    {
        window.AndroidBridge.loginFacebook();
    } catch (e)
    {

    }
}

function setFacebookData(email)
{
    facebook.email = email;

    displayWhatever(JSON.stringify(facebook));
}

function facebookLogged()
{
    facebook.logged = true;
}

// #######################################################################
// #######################################################################
// ############################### LOADING ###############################
// #######################################################################
// #######################################################################

async function init()
{
    if (typeof uuid !== "undefined" && isAdMobReady)
    {
        if (await authenticate())
        {
            loadData();
        }
    }
    else
    {
        setTimeout(init, 100);
    }
}

async function loadData()
{
    //TODO
    await loadHomeData();
    setTimeout(showHomeVideo, 1000);
}

async function authenticate()
{
    return await request("login", "POST", {'uuid': uuid, 'secret_id': SECRET_ID}, parseLoginData);
}

// #######################################################################
// #######################################################################
// ############################### TRANSFER ##############################
// #######################################################################
// #######################################################################

function setCookie(cname, cvalue)
{
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

function getCookie(cname)
{
    let name = cname + "=";
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        while (c.charAt(0) === ' ')
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0)
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname)
{
    const d = new Date();
    d.setTime(d.getTime() - (15 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/;SameSite=Strict";
}

async function request(target, type, data, parser)
{
    let jwtToken = getCookie("jwt_token");

    if (target !== "login")
    {
        if (jwtToken === "")
        {
            document.querySelector("#test").innerHTML = jwtToken;
            // authenticate();

            return;
        }
    }

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwtToken);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    let requestOptions = {
        method: type,
        headers: myHeaders,
        redirect: 'follow'
    };

    if (type !== "GET" && type !== "HEAD")
    {
        requestOptions.body = JSON.stringify(data);
    }

    try
    {
        let res = await fetch("http://192.168.0.69:8080/" + target, requestOptions);
        res = await checkResponse(res);
        res = await parser(JSON.parse(res));
        setCookie("jwt_token", res);

        return true;
    } catch (error)
    {
        document.querySelector("#test").innerHTML = "target : " + target;
        document.querySelector("#test").innerHTML += "<br>error : " + error;
        return false;
        //TODO authenticate or close app?
    }
}

function checkResponse(res)
{
    if (res.status === 200)
    {
        return res.text();
    }

    if (res.status === 401 || res.status === 403)
    {
        //TODO authenticate or close app?
        return res.text();
    }

    //TODO authenticate or close app?
    return res.text();
}

// #######################################################################
// #######################################################################
// ############################### REQUESTS ##############################
// #######################################################################
// #######################################################################
async function loadHomeData()
{
    return await request("home", "GET", {}, parseHomeData);
}

async function loadUserLevelsData(mod_)
{
    mod = mod_;
    return await request("levels/" + mod, "GET", {}, parseUserLevelsData);
}

async function loadLevel(level_id_)
{
    level_id = level_id_;
    return await request("level/" + mod + "/" + level_id, "GET", {}, parseLevelData);
}

async function sendResultLevel(time)
{
    return await request("level/" + mod + "/" + level_id, "PATCH", {'time': time}, parseSendResultLevelData);
}

// #######################################################################
// #######################################################################
// ############################### PARSERS ###############################
// #######################################################################
// #######################################################################
function parseLoginData(res)
{
    console.log(res);
    document.querySelector("#test").innerHTML = "" + res.message;
    if (res.status !== "failure")
    {
        document.querySelector("#test").innerHTML = "new : " + res.new;
    }

    return res.token;
}

function parseHomeData(res)
{
    console.log(res);
    document.querySelector("#test").innerHTML = "" + res;

    if (res.status !== "failure")
    {
        document.querySelector("#home").querySelector("#data_home_level").textContent = res.user.level;
        document.querySelector("#home").querySelector("#data_home_map_win").textContent = res.user.map_win;
        document.querySelector("#home").querySelector("#data_home_points").textContent = res.user.points;
        document.querySelector("#home").querySelector("#data_home_diamonds").textContent = res.user.diamonds;
        document.querySelector("#home").querySelector("#data_home_rank").textContent = res.user.rank;
        // document.querySelector("#test").innerHTML = "new : " + res.new;
    }

    return res.token;
}

function parseUserLevelsData(res)
{
    console.log(res);
    // document.querySelector("#test").innerHTML = "" + res;

    if (res.status !== "failure")
    {
        let levelList = document.querySelector("#levelList");

        levelList.innerHTML = "";

        for (let i = 0; i < res.maps_id.length; i++)
        {
            let div = document.createElement("div");
            div.textContent = "" + (i + 1);
            div.classList.add("level-box");
            levelList.appendChild(div);
        }

        levelList.style.width = "unset";

        let lastLevel = Array.from(levelList.querySelectorAll('.level-box')).pop();
        if (lastLevel !== undefined)
        {
            let lastLevelStyle = getComputedStyle(lastLevel);
            levelList.style.width = (convertPXToVH(lastLevelStyle.left) + (convertPXToVH(lastLevelStyle.width) * 2)) + "vh";
        }

        let boxes = levelList.querySelectorAll(".level-box");

        for (let i = 0; i < res.user_maps.length; i++)
        {
            boxes[i].classList.add("enable");
            boxes[i].classList.remove("next");
            boxes[i].onclick = function ()
            {
                showVideo1(res.maps_id[i].id);
            };
        }

        if (boxes[res.user_maps.length] !== undefined)
        {
            boxes[res.user_maps.length].classList.add("enable");
            boxes[res.user_maps.length].classList.add("next");
            boxes[res.user_maps.length].onclick = function ()
            {
                showVideo1(res.maps_id[res.user_maps.length].id);
            };
        }
    }

    return res.token;
}

function parseLevelData(res)
{
    console.log(res);
    document.querySelector("#test").innerHTML = "" + res;

    if (res.status !== "failure")
    {
        extractLevel(JSON.parse(res.map.data));
    }

    return res.token;
}

function parseSendResultLevelData(res)
{
    console.log(res);
    document.querySelector("#test").innerHTML = "" + res;

    if (res.status !== "failure")
    {
        showGameResult(res);
    }

    return res.token;
}