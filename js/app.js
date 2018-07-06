var card, cards;
var totalLength;
var moves = 0;
var stage = 0;
var tempArray = [];

// All cards in game
var deck = document.getElementById("card-deck");


var counter = document.querySelector(".moves");
var stageCounter = document.querySelector(".stage");

//variable of matchedCards
var matchedCard = document.getElementsByClassName("match");

// close icon in modal
var closeicon = document.querySelector(".close");

// declare modal
function gridSelected(event) {
    tempArray = []
    totalLength = event.target.value;
    localStorage.setItem('totalLength', totalLength);
    document.getElementById("card-deck").innerHTML = "";
    for (var i = 1; i <= (totalLength * totalLength); i++) {
        if (i <= (totalLength * totalLength) / 2) {
            tempArray.push("<li class='card' type='" + i + "'>" + i + "</li>");
            tempArray.push("<li class='card' type='" + i + "'>" + i + "</li>");
        }
    }
    cards = tempArray;
    startGame();
}

var modal = document.getElementById("popup1")

// array for opened cards
var openedCards = [];

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

// start game function 
function startGame() {
    document.getElementById("card-deck").style.display = "flex";
    resetGame();
    // shuffle deck
    cards = shuffle(cards);
    cards.forEach(function (item) {
        deck.innerHTML += item;
        deck.classList.remove("show", "open", "match", "disabled", "no-event", "unmatched");
    });
    addEventListners();
    // reset moves
    moves = 0;
    stage = 0;
    counter.innerHTML = moves;
    stageCounter.innerHTML = stage;
    setWidthOfCards();
}
function setWidthOfCards() {
    var cardsWidth = 0;
    switch (totalLength) {
        case "2":
            cardsWidth = 225;
            break;
        case "4":
            cardsWidth = 100;
            break;
        case "6":
            cardsWidth = 57;
            break;
        case "8":
            cardsWidth = 37;
            break;
        case "10":
            cardsWidth = 25;
            break;
    }
    for (var i = 0; i < (totalLength * totalLength); i++) {
        document.getElementsByTagName("li")[i].style.width = cardsWidth + "px";
        document.getElementsByTagName("li")[i].style.height = cardsWidth + "px";
    }
}

var displayCard = function () {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

// add opened cards and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if (len === 2) {
        moveCounter();
        if (openedCards[0].type === openedCards[1].type) {
            countStage();
            matched();
        } else {
            unmatched();
        }
    }
};

//when cards match
function matched() {
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
    saveGame();
}

//when cards don't match
function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function () {
        openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
        openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
        enable();
        openedCards = [];
        saveGame();
    }, 1000);
}

//disable cards temporarily
function disable() {
    cards.forEach(function (card) {
        card.classList.add('disabled');
    });
}

//enable cards and disable matched cards
function enable() {
    cards.forEach(function (card) {
        card.classList.remove('disabled');
    });
}

//count moves
function moveCounter() {
    moves++;
    counter.innerHTML = moves;
}
//count stage
function countStage() {
    stage++;
    stageCounter.innerHTML = stage;
}

// congratulation message
function congratulations() {
    if (matchedCard.length == (totalLength * totalLength)) {
        setTimeout(function () {
            // show congratulations modal
            modal.classList.add("show");
            document.getElementById("finalMove").innerHTML = moves;
            closeModal();
            resetGame()
        }, 500);
    }
}

//close icon 
function closeModal() {
    closeicon.addEventListener("click", function (e) {
        modal.classList.remove("show");
        reloadGame();
    });
}
function reloadGame() {
    cards = shuffle(cards);
    deck.innerHTML = ""
    cards.forEach(function (item) {
        item.classList.remove("show", "open", "match", "disabled", "no-event", "unmatched");
        deck.innerHTML += item.outerHTML;

    });
    addEventListners()
    moves = 0;
    stage = 0;
    counter.innerHTML = moves;
    stageCounter.innerHTML = stage;
    resetGame();
}
function resetGame() {
    localStorage.removeItem('gameGrid');
    localStorage.removeItem('gameStage');
    localStorage.removeItem('totalMoves');
    localStorage.removeItem('totalLength');
}


function saveGame() {
    localStorage.setItem('totalLength', totalLength);
    localStorage.setItem('gameGrid', document.getElementById("card-deck").innerHTML);
    localStorage.setItem('gameStage', stage);
    localStorage.setItem('totalMoves', moves);
}
window.onload = function () {
    savedGame = localStorage.getItem('gameGrid');
    stageCounter.innerHTML = localStorage.getItem('gameStage');
    stage = localStorage.getItem('gameStage');
    moves = localStorage.getItem('totalMoves');
    counter.innerHTML = localStorage.getItem('totalMoves');
    totalLength = localStorage.getItem('totalLength');
    if (savedGame != null) {
        document.getElementById("ddValue").value = totalLength
        document.getElementById("card-deck").innerHTML = savedGame;
        document.getElementById("card-deck").style.display = "flex";
        addEventListners();
    }
};
function addEventListners() {
    card = document.getElementsByClassName("card");
    cards = Array.from(card);
    // loop to add event listeners to each card
    for (var i = 0; i < cards.length; i++) {
        card = cards[i];
        card.addEventListener("click", displayCard);
        card.addEventListener("click", cardOpen);
        card.addEventListener("click", congratulations);
    }
}