function changePage(currentScore) {
    window.location = "Index.html";
    console.log("hej");
    $("#name-input-box").css("background-color", "white")
}


function changeVisibility(show){
    var box = $("#name-input-box");
    show == true ? box.css("visibility", "visible") : box.css("visibility", "hidden");
}
