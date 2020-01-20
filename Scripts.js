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
    highscore = storage.slice(0);

    if (highscore.length > 0) {
        for (let item of highscore) {
            if (item.slice(0, nameLength) == name) {
                exists = true;
                if (parseInt(item.slice(nameLength + 1)) < tempScore) {
                    exists = false;
                    const index = highscore.indexOf(item);
                    highscore.splice(index, 1);
                }
            }
        }
    }

    if (!exists) {
        highscore.push(name + ": " + tempScore);
    }


    localStorage.setItem("highscore", JSON.stringify(highscore));
}

function submitName() {
    var name = $("#name-input").val();
    addScoreToStorage(name);
    changeVisibility(false);
    sessionStorage.clear();
}

function printHighscore() {
    var highscore = JSON.parse(localStorage.getItem("highscore"));
    var leaderboard = $("#leaderboard-list");
    if (highscore.length > 0) {
        for (const high of highscore) {
            let temp = document.createElement("li");
            temp.innerText = high;
            leaderboard.append(temp);
        }
    }
}