function changePage() {
    window.location = "Index.html";
}


function changeVisibility(show) {
    var box = $("#name-input-box");
    show == true ? box.css("visibility", "visible") : box.css("visibility", "hidden");
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
    storage = null ?? [];
    highscore = storage.slice(0);

    for (let item of highscore) {
        if (item.slice(0, nameLength) == name) {
            exists = true;
            if (parseInt(item.slice(nameLength + 1)) < tempScore) {
                item = (name + ": " + tempScore);
            }
        }
    }

    if(!exists){
        highscore.push(name + ": " + tempScore);
    }


    localStorage.setItem("highscore", JSON.stringify(highscore));
}

function submitName() {
    var name = $("#name-input").val();
    addScoreToStorage(name);
}