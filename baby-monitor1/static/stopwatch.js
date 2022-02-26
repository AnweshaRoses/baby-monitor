// Convert time to a format of hours, minutes, seconds, and milliseconds

function timeToString(time) {
	let diffInHrs = time / 3600000;
	let hh = Math.floor(diffInHrs);
      
	let diffInMin = (diffInHrs - hh) * 60;
	let mm = Math.floor(diffInMin);
      
	let diffInSec = (diffInMin - mm) * 60;
	let ss = Math.floor(diffInSec);
      
	let formattedHH = hh.toString().padStart(2, "0");
	let formattedMM = mm.toString().padStart(2, "0");
	let formattedSS = ss.toString().padStart(2, "0");
      
	return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

// Declare variables to use in our functions below

let startTime;
let elapsedTime = 0;
let timerInterval;

// Create function to modify innerHTML

function print(txt) {
	document.getElementById("display").innerHTML = txt;
}

// Create "start", "pause" and "reset" functions

function start() {
	startTime = Date.now() - elapsedTime;
	timerInterval = setInterval(function printTime() {
		elapsedTime = Date.now() - startTime;
		print(timeToString(elapsedTime));
	}, 10);
	// showButton("PAUSE");
}

function pause_time() {
	clearInterval(timerInterval);
	// showButton("PLAY");
}

function get_time(finaltime) {
	hh = finaltime.substring(0,2);
	mm = finaltime.substring(3,5);
	ss = finaltime.substring(6);
	if(hh == 0 && mm != 0 && ss != 0) {
		return `${mm} minutes and ${ss} seconds`;
	}
	else if(mm == 0 && hh!= 0 && ss !=0) {
		return `${hh} hours and ${ss} seconds`;
	}
	else if(hh == 0 && mm == 0){
		return `${ss} seconds`;
	}
	else{
		return `${hh} hours ${mm} minutes and ${ss} seconds`;
	}
}

function reset() {
	alert(`Your baby has been monitored for ${get_time(timeToString(elapsedTime))}`);
	clearInterval(timerInterval);
	print("00:00:00");
	elapsedTime = 0;
	// showButton("PLAY");
      }
      
      // Create function to display buttons
      
//       function showButton(buttonKey) {
// 	const buttonToShow = buttonKey === "PLAY" ? playButton : pauseButton;
// 	const buttonToHide = buttonKey === "PLAY" ? pauseButton : playButton;
// 	buttonToShow.style.display = "block";
// 	buttonToHide.style.display = "none";
//       }
      // Create event listeners
      
//       let playButton = document.getElementById("monitor_btn");
//       let pauseButton = document.getElementById("monitor_btn");
//       let resetButton = document.getElementById("resetButton");
      
//       playButton.addEventListener("click", start);
//       pauseButton.addEventListener("click", pause);
//       resetButton.addEventListener("click", reset);