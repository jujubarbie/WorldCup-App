let uuid = "test"; //TODO change before launch
let SECRET_ID = "enorux"; //TODO change before launch
let isAdMobReady = true; //TODO change before launch
let isInterstitialAdReady = false;
let noAdCanBeLoad = false;
let videoIntroShown = false;
let userChoice = null;
let countries = null;
let predictions = null;
let ready = false;
let currentSelection = -1;
let currentElem = null;

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

function showAd()
{
    try
    {
        window.AndroidBridge.showAd();
    } catch (e)
    {

    }
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
    if(userChoice.id == null)
    {
        await loadCountriesData();

        populateCountriesForm();
    }
    else
    {
        populateSeePredictions();
    }

    ready = true;
}

function populateCountriesForm()
{
    let countriesForm = document.querySelector("#countries_choice");
    for(let i = 0; i < countries.length; i++)
    {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = "images/" + countries[i].id + ".png";
        img.alt = "" + countries[i].name;
        img.setAttribute('onclick',"selectCountry(this, \'" + countries[i].id + "\')")
        div.appendChild(img);
        countriesForm.appendChild(div);
    }
}

function selectCountry(elem, id)
{
    if(currentElem != null)
    {
        currentElem.classList.remove("selected");
    }
    currentElem = elem;
    currentElem.classList.add("selected");

    console.log(id);
    currentSelection = id;
}

function validChoice()
{
    if(currentSelection !== -1 && currentSelection <= countries[countries.length - 1].id)
    {
        sendVote();
        populateSelected();
        populateSeePredictions();
        showSelected();
    }
}

function populateSelected()
{
    let userChoiceImg = document.querySelector("#userChoiceImg");
    let userChoiceName = document.querySelector("#userChoiceName");
    userChoice = countries.find(obj => obj.id == currentSelection);

    userChoiceImg.src = "images/" + userChoice.id + ".png";
    userChoiceImg.alt = "" + userChoice.name;
    userChoiceName.innerHTML = "" + userChoice.name;
}

function populateSeePredictions()
{
    let selectedCountryName = document.querySelector("#selectedCountryName");
    selectedCountryName.innerHTML = "" + userChoice.name;
}

function populatePredictions()
{
    let voteAmount = 0;
    let countriesPredictions = document.querySelector("#countriesPredictions");
    let voteAmountElem = document.querySelector("#voteAmount");

    for(let i = 0; i < predictions.length; i++)
    {
        voteAmount += predictions[i].vote_amount;
    }

    voteAmountElem.innerHTML = "" + voteAmount;

    for(let i = 0; i < predictions.length; i++)
    {
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = "images/" + predictions[i].id + ".png";
        img.alt = "" + predictions[i].name;
        div.appendChild(img);
        const span = document.createElement("span");
        span.innerHTML = "" + (predictions[i].vote_amount / voteAmount * 100).toFixed(0) + "%";
        div.appendChild(span);
        countriesPredictions.appendChild(div);
    }
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
async function authenticate()
{
    return await request("login", "POST", {'uuid': uuid, 'secret_id': SECRET_ID}, parseLoginData);
}

async function loadCountriesData()
{
    return await request("countries", "GET", {}, parseCountriesData);
}

async function loadPredictionsData()
{
    return await request("countries_vote", "GET", {}, parsePredictionsData);
}

async function sendVote()
{
    return await request("vote/" + currentSelection, "PATCH", {}, parseVoteData);
}

// #######################################################################
// #######################################################################
// ############################### PARSERS ###############################
// #######################################################################
// #######################################################################
function parseLoginData(res)
{
    console.log(res);

    if(res.status === "success")
    {
        if(res.country_vote !== undefined)
        {
            userChoice = res.country_vote;
        }
    }

    return res.token;
}

function parseCountriesData(res)
{
    console.log(res);

    if (res.status === "success")
    {
        if(res.countries !== undefined)
        {
            countries = res.countries;
        }
    }

    return res.token;
}

function parsePredictionsData(res)
{
    console.log(res);

    if (res.status === "success")
    {
        if(res.countries !== undefined)
        {
            predictions = res.countries;
        }
    }

    return res.token;
}

function parseVoteData(res)
{
    console.log(res);

    if (res.status === "success")
    {
        console.log("ok");
    }

    return res.token;
}