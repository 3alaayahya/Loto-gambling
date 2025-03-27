let userBalance = 1000;
const lotteryCost = 300;
let gameEnded = false;

// Array to store selected numbers
let selectedNumbers = [];
let powerNumber = 0;
let randomPowerNum = Math.floor(Math.random() * 7) + 1; // Generate random number between 1 and 7
let randomNumbers = generateRandomNumbers();
console.log("Random Numbers:", randomNumbers);
console.log("Random Power Number:", randomPowerNum);

function generateRandomNumbers() {
    let randomNumbers = [];
    // Generate 6 unique random numbers
    while (randomNumbers.length < 6) {
        let randomNumber = Math.floor(Math.random() * 36) + 1; // Generate random number between 1 and 37

        // Check if the random number is not already in the array
        if (!randomNumbers.includes(randomNumber)) {
            randomNumbers.push(randomNumber);
        }
    }

    return randomNumbers;
}

// Function to handle click event on <td> elements
function handleClick(td) {
    // Get the number from the clicked <td> element
    let number = parseInt(td.innerText);
    // Check if the number is not NaN (Not a Number)
    if (!isNaN(number)) {
        // Check if the number already exists in the array
        let index = selectedNumbers.indexOf(number);

        if (index === -1 && selectedNumbers.length < 6) {
            // If the number doesn't exist in the array, add it
            selectedNumbers.push(number);
            td.classList.add('selected');
            td.classList.add('blueBack'); // Add class for blue background color
            td.classList.remove('redBack');
        } else if (selectedNumbers.length == 6 && index === -1) {
            alert("יש לבחור רק 6 מספרים, לחץ על מספר שברצונך למחוק")
        }
        else {
            // If the number exists in the array, remove it
            selectedNumbers.splice(index, 1);
            td.classList.remove('selected');
            td.classList.add('redBack'); // Add class for red background color
            td.classList.remove('blueBack');
        }

        console.log(selectedNumbers); // Output the updated array
    }
}

let prevClickedTd = null; 

function handlePowerNumClick(td) {
    // Remove blue background from previously clicked <td> element
    if (prevClickedTd !== null) {
        prevClickedTd.classList.remove('blueBack');
        prevClickedTd.classList.add('redBack');
    }

    // Toggle the background color class
    if (td.classList.contains('redBack')) {
        td.classList.remove('redBack');
        td.classList.add('blueBack');
    } else {
        td.classList.remove('blueBack');
        td.classList.add('redBack');
    }

    // Get the number from the clicked <td> element
    let number = parseInt(td.innerText);

    // Check if the number is not NaN (Not a Number)
    if (!isNaN(number)) {
        // Update the powerNum variable with the clicked number
        powerNumber = number;
        console.log("Power Number:", powerNumber); // Output the updated powerNum
    }

    // Update the previously clicked <td> element
    prevClickedTd = td;
}

// Create a function to handle clicks on <td> elements
function tdClickHandler(event) {
    let clickedTd = event.target;
    handleClick(clickedTd);
}

// Get all <td> elements
let tds = document.querySelectorAll('td');

// Attach click event listener to each <td> element
tds.forEach(td => {
    td.addEventListener('click', function () {
        tdClickHandler(event);
    });
});

let str = "<h2>בחר 6 מספרים</h2><br />";
str += "<table>"
for (var i = 1; i <= 36; i += 6) {
    str += "<tr>"
    for (var j = 0; j < 6; j++) {
        str += "<td class='redBack White' onclick='handleClick(this)'><h2>" + (i + j) + "</h2></td>"
    }
    str += "</tr>"

}
str += "</table>"
document.querySelector("#allNums").innerHTML += str;

let str1 = "<h2>בחר מספר חזק</h2><br />";
str1 += "<table>"
for (var i = 0; i < 7; i++) {
    str1 += "<tr>"
    for (var j = 0; j < 1; j++) {
        str1 += "<td class='redBack White' onclick='handlePowerNumClick(this)'><h2>" + (i + 1) * (j + 1) + "</h2></td>"
    }
    str1 += "</tr>"

}
str1 += "</table>"
document.querySelector("#PowerNums").innerHTML += str1;

document.getElementById('check-button').addEventListener('click', function () {
    if (!gameEnded) {
        checkLottery();
    } else {
        alert("The game has ended. You cannot play further.");
    }
});

document.getElementById('finish-button').addEventListener('click', function () {
    endGame();
});


function canUserPlay() {
    return userBalance >= lotteryCost;
}
function checkLottery() {
    if (!canUserPlay()) {
        alert("אין לך מספיק כסף לשחק בהגרלה");
        return;
    }

    // Check if user has selected exactly 6 numbers
    if (selectedNumbers.length !== 6) {
        alert("בבקשה לבחור 6 מספרים בדיוק!");
        return;
    }

    // Check if a power number has been selected
    if (powerNumber === 0) {
        alert("בבקשה לבחור מספר חזק!");
        return;
    }


    // Call checkResult with the appropriate parameters
    let prize = checkResult(randomNumbers, selectedNumbers, powerNumber, randomPowerNum);
    displayResults(randomNumbers, selectedNumbers, powerNumber, randomPowerNum, prize);
    updateUserBalance(prize - lotteryCost);
    let random = Math.floor(Math.random() * 7) + 1; // Generate random number between 1 and 7
    randomPowerNum = random;
    randomNumbers = generateRandomNumbers();
    console.log("Random Numbers:", randomNumbers);
    console.log("Random Power Number:", randomPowerNum);
    resetGame();
}

function resetGame() {
    // Reset background color of all <td> elements to red
    let tds = document.querySelectorAll('td');
    tds.forEach(td => {
        td.classList.remove('blueBack');
        td.classList.add('redBack');
    });
    // Reset powerNumber to 0
    powerNumber = 0;
    console.log(powerNumber);
    // Empty the selectedNumbers array
    selectedNumbers = [];
    console.log("selected numbers:" + selectedNumbers);
}

function checkResult(winningNumbers, selectedNumbers, powerNumber, randomPowerNum) {
    let count = 0;
    for (let num of selectedNumbers) {
        if (winningNumbers.includes(num)) {
            count++;
        }
    }
    if (count === 6 && randomPowerNum === powerNumber) {
        return 1000;
    } else if (count === 6 && randomPowerNum != powerNumber) {
        return 600;
    } else if (count === 4 && randomPowerNum === powerNumber) {
        return 400;
    } else {
        return 0;
    }
}

function updateUserBalance(prize) {
    userBalance += prize;
    updateBalanceDisplay(); // Update balance display
    if (userBalance < lotteryCost) {
        endGame();
    }
}

function updateBalanceDisplay() {
    document.getElementById('wallet').innerText = "סכום: " + userBalance + "שח";
}

function displayResults(winningNumbers, selectedNumbers, powerNumber, randomPowerNumber, prize) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Lottery Results</h2>
        <h5>מספרים ההגרלה: ${randomNumbers.join(', ')}</h5>
        <h5>מספר החזק: ${randomPowerNumber}</h5>
        <h5>המספרים שלך:: ${selectedNumbers.join(', ')}</h5>
        <h5>המספר החזק שלך: ${powerNumber}</h5>
        <h5>פרס: ${prize} שקלים</h5>
      `;
}

function endGame() {
    gameEnded = true;
    alert("המשחק נגמר, הסכום שזכית: " + userBalance + " שקלים.");
    document.getElementById('check-button').disabled = true;
    document.getElementById('finish-button').disabled = true;
}