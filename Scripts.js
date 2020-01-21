function changePage() {
    window.location.href = "Index.html";
}


function changeVisibility(show) {
    var box = $("#name-input-box");

    if (show) {
        box.css("visibility", "visible")
    }
    else {
        box.css("visibility", "hidden")
    }
}

//Kollar om score är större än 0 för input rutan inte ska visas annars 
function checkScore() {
    let data = sessionStorage.getItem('tempScore')
    if (data > 0) {
        changeVisibility(true);
    }
}

function addScoreToStorage(name) {
    var highscore = [];
    const tempScore = sessionStorage.getItem('tempScore');
    const nameLength = name.length;
    var exists = false;

    var storage = JSON.parse(localStorage.getItem("highscore"));
    if (storage == null) {
        storage = [];
    }
    //Kopierar alla värden från storage
    highscore = storage.slice(0);

    if (highscore.length > 0) {
        for (let item of highscore) {
            //Kollar om det nya namnet finns och då sätter exists till true
            if (item.key == name) {
                exists = true;
                //Kollar om score redan finns i arrayen
                if (item.value < tempScore) {
                    exists = false;
                }
            }
        }
    }

    //Pushar ett nytt objekt om exists är false
    if (!exists) {
        //Pushar ett objekt med key och value som properties för att det blir enklare att sortera
        highscore.push({
            key: name,
            value: tempScore
        });
    }

    //Sorterar highscore arrayens objekts value property så att högsta nummret är i början.
    highscore.sort((a,b) => b.value - a.value);
    localStorage.setItem("highscore", JSON.stringify(highscore));
}

//Hämtar värdet på inputen som max kan var 8 karaktärer lång och kallar på andra funktioner.
function submitName() {
    var name = $("#name-input").val();
    addScoreToStorage(name);
    changeVisibility(false);
    sessionStorage.clear();
}

//Hämtar ut highscore array och parsar den från local storage och kollar om längden på arrayen är längre än 0 isådanafall skriv ut highscoren
function printHighscore() {
    // tar bort alla hs klasser så att den inte råkar skriva ut en sak flera gånger.
    $(".hs").remove();
    var highscore = JSON.parse(localStorage.getItem("highscore"));
    var leaderboard = $("#leaderboard-list");
    if (highscore.length > 0) {
        for (const high of highscore) {
            let temp = document.createElement("li");
            temp.setAttribute("class", "hs")
            temp.innerText = `${high.key}: ${high.value}`;
            leaderboard.append(temp);
        }
    }
}