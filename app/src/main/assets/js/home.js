function showTheBestBox()
{
	let theBestBox = document.querySelector("#theBestBox");
	theBestBox.style.width = "20%";
	theBestBox.querySelector("#theBestArrowExpand").style.display = "none";

	setTimeout(function()
	{
		document.querySelector("#home").addEventListener("click", hideTheBest);
	}, 100);
}

function hideTheBest(e)
{
	let theBestBox = document.querySelector("#theBestBox");
	if(e.target !== theBestBox)
	{
		theBestBox.style.width = "6%";
		theBestBox.querySelector("#theBestArrowExpand").style.display = "block";
		document.querySelector("#home").removeEventListener("click", hideTheBest);
	}
}
