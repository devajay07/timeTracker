document.addEventListener("DOMContentLoaded", function () {
  const currentTimeElement = document.getElementById("currentTime");
  const totalTimeElement = document.getElementById("totalTime");
  const startButton = document.getElementById("startButton");
  const endButton = document.getElementById("endButton");
  const timeList = document.getElementById("timeList");
  const countdownElement = document.getElementById("countdown");
  const countdownDisplay = document.getElementById("countdownDisplay");
  const historicalDataSection = document.getElementById(
    "historicalDataSection"
  );
  const historicalDataList = document.getElementById("historicalDataList");

  const cuetExamDate = new Date("2024-03-10");
  updateExamCountdown("cuetExamCountdown", cuetExamDate);

  // Calculate and display the countdown for NIMCET Exam (10 June)
  const nimcetExamDate = new Date("2024-06-10"); // 5 corresponds to June (0-indexed)
  updateExamCountdown("nimcetExamCountdown", nimcetExamDate);

  function updateExamCountdown(elementId, examDate) {
    const countdownElement = document.getElementById(elementId);

    function updateCountdown() {
      const now = new Date();
      const timeLeft = examDate - now;

      if (timeLeft <= 0) {
        countdownElement.textContent = "Today!";
      } else {
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        countdownElement.textContent = `${daysLeft} days`;
      }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  function displayHistoricalData() {
    // Retrieve historical data from local storage
    const historicalData =
      JSON.parse(localStorage.getItem("historicalData")) || {};

    // Sort the historical data by date in descending order
    const sortedDates = Object.keys(historicalData).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA;
    });

    // Clear the previous list of historical data
    historicalDataList.innerHTML = "";

    // Display historical data in the list
    sortedDates.forEach((date) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${date}: ${historicalData[date].toFixed(
        2
      )} hours`;
      historicalDataList.appendChild(listItem);
    });

    // Show the historical data section
    historicalDataSection.style.display = "block";
  }

  // Call the displayHistoricalData function to initially populate the historical data when the page loads
  displayHistoricalData();

  let startTime = null;
  let totalTime = 0;
  let timeDetails = [];
  let interval;

  clearStorageButton.addEventListener("click", function () {
    const confirmation = confirm(
      "Are you sure you want to clear the current session?"
    );
    if (confirmation) {
      // Save the total hours of the current session as historical data
      if (startTime !== null) {
        const endTime = new Date();
        const timeDiff = (endTime - startTime) / 3600000; // Convert milliseconds to hours
        const currentDate = new Date();
        const dateString = `${currentDate.getFullYear()}-${
          currentDate.getMonth() + 1
        }-${currentDate.getDate()}`;
        const historicalData =
          JSON.parse(localStorage.getItem("historicalData")) || {};

        if (!historicalData[dateString]) {
          historicalData[dateString] = 0;
        }

        historicalData[dateString] += timeDiff;

        localStorage.setItem("historicalData", JSON.stringify(historicalData));
      }

      // Start a new session
      clearLocalStorage();
      location.reload(true); // Reload the page after clearing storage
    }
  });

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  function updateElapsedTime() {
    interval = setInterval(function () {
      const now = new Date();
      countdownDisplay.style.display = "block";
      countdownElement.style.display = "block";
      // countdownElement.textContent = "hello";
      const elapsedTime = (now - startTime) / 1000; // Elapsed time in seconds
      const minutes = Math.floor(elapsedTime / 60);
      const seconds = Math.floor(elapsedTime % 60);
      countdownDisplay.textContent = `${formatTime(minutes)}:${formatTime(
        seconds
      )}`;
    }, 1000);

    // Store the interval ID so it can be cleared later
    countdownElement.dataset.intervalId = interval;
  }

  // Function to update the current time display
  function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    currentTimeElement.textContent = `${formatTime(hours)}:${formatTime(
      minutes
    )}`;
  }

  updateCurrentTime();

  // Function to start the timer
  startButton.addEventListener("click", function () {
    startTime = new Date();
    updateCurrentTime();
    startButton.disabled = true;
    startButton.style.display = "none";
    endButton.disabled = false;
    updateElapsedTime();
  });

  // Function to end the timer and save the time period
  endButton.addEventListener("click", function () {
    startButton.style.display = "block";
    if (startTime !== null) {
      const endTime = new Date();
      const timeDiff = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      totalTime += timeDiff;
      timeDetails.push({
        start: `${formatTime(startTime.getHours())}:${formatTime(
          startTime.getMinutes()
        )}`,
        end: `${formatTime(endTime.getHours())}:${formatTime(
          endTime.getMinutes()
        )}`,
      });

      // Update the UI
      totalTimeElement.textContent = totalTime.toFixed(2) + " hours";
      startButton.disabled = false;
      endButton.disabled = true;

      // Update the time details list
      const listItem = document.createElement("li");
      listItem.textContent = `${timeDetails.length}. ${formatTime(
        startTime.getHours()
      )}:${formatTime(startTime.getMinutes())} - ${formatTime(
        endTime.getHours()
      )}:${formatTime(endTime.getMinutes())}`;
      timeList.appendChild(listItem);

      // Save data to local storage
      localStorage.setItem("totalTime", totalTime);
      localStorage.setItem("timeDetails", JSON.stringify(timeDetails));
      clearInterval(interval); // Assuming 'interval' is in scope here
      countdownDisplay.textContent = "00:00";
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

  // Update the current time every minute
  setInterval(updateCurrentTime, 60000);
});

const clearStorageButton = document.getElementById("clearStorageButton");

// Function to clear local storage
function clearLocalStorage() {
  localStorage.removeItem("totalTime");
  localStorage.removeItem("timeDetails");
  totalTime = 0;
  timeDetails = [];
  timeList.innerHTML = ""; // Clear the time details list
}
