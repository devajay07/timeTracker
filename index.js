document.addEventListener("DOMContentLoaded", function () {
  const currentTimeElement = document.getElementById("currentTime");
  const totalTimeElement = document.getElementById("totalTime");
  const startButton = document.getElementById("startButton");
  const endButton = document.getElementById("endButton");
  const timeList = document.getElementById("timeList");
  const countdownElement = document.getElementById("countdown");
  const countdownDisplay = document.getElementById("countdownDisplay");
  let countdownInterval;

  let startTime = null;
  let totalTime = 0;
  let timeDetails = [];

  function startCountdown() {
    countdownElement.style.display = "block";
    const endTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour in milliseconds
    countdownInterval = setInterval(updateCountdown, 1000);

    function updateCountdown() {
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.textContent = "00:00:00";
        countdownElement.style.display = "none";
      } else {
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        countdownDisplay.textContent = `${formatTime(hours)}:${formatTime(
          minutes
        )}:${formatTime(seconds)}`;
      }
    }

    function formatTime(time) {
      return time < 10 ? `0${time}` : time;
    }
  }

  // Function to update the current time display
  function updateCurrentTime() {
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleTimeString();
  }

  // Function to start the timer
  startButton.addEventListener("click", function () {
    startTime = new Date();
    updateCurrentTime();
    startButton.disabled = true;
    startButton.style.display = "none";
    endButton.disabled = false;
    startCountdown();
  });

  // Function to end the timer and save the time period
  endButton.addEventListener("click", function () {
    startButton.style.display = "block";
    if (startTime !== null) {
      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      totalTime += timeDiff;
      timeDetails.push({
        start: startTime.toLocaleTimeString(),
        end: endTime.toLocaleTimeString(),
      });

      // Update the UI
      totalTimeElement.textContent = totalTime.toFixed(2) + " hours";
      startButton.disabled = false;
      endButton.disabled = true;

      // Update the time details list
      const listItem = document.createElement("li");
      listItem.textContent = `${
        timeDetails.length
      }. ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`;
      timeList.appendChild(listItem);

      // Save data to local storage
      localStorage.setItem("totalTime", totalTime);
      localStorage.setItem("timeDetails", JSON.stringify(timeDetails));
    }
  });

  // Load data from local storage on page load
  const storedTotalTime = localStorage.getItem("totalTime");
  const storedTimeDetails = localStorage.getItem("timeDetails");

  if (storedTotalTime) {
    totalTime = parseFloat(storedTotalTime);
    totalTimeElement.textContent = totalTime.toFixed(2) + " hours";
  }

  if (storedTimeDetails) {
    timeDetails = JSON.parse(storedTimeDetails);
    timeDetails.forEach((detail, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${detail.start} - ${detail.end}`;
      timeList.appendChild(listItem);
    });
  }

  // Update the current time every second
  setInterval(updateCurrentTime, 1000);
});
const clearStorageButton = document.getElementById("clearStorageButton");

// Function to clear local storage
function clearLocalStorage() {
  localStorage.removeItem("totalTime");
  localStorage.removeItem("timeDetails");
  totalTime = 0;
  timeDetails = [];
  // totalTimeElement.textContent = "0 hours";
  timeList.innerHTML = ""; // Clear the time details list
}

clearStorageButton.addEventListener("click", function () {
  const confirmation = confirm("Are you sure you want to clear all data?");
  if (confirmation) {
    clearLocalStorage();
    location.reload(true);
  }
});

// ... Existing code ...
