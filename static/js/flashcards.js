$(document).ready(function() {

    var colorArray = ["#706fff", "#ce6fff", "#e56d53", "#d7aa0f", "#97c043"];
    var cardState;
    var currentQuestion = 0;
    var qbank = new Array;

    loadDB();

    function loadDB() {
        let data = {
            "subject": ''
        }
        $.getJSON("cards", data,
            function(data) {
                for (i = 0; i < data.questionlist.length; i++) {
                    qbank[i] = [];
                    qbank[i][0] = data.questionlist[i].cardfront;
                    qbank[i][1] = data.questionlist[i].cardback;
                }
                beginActivity();
            });
    } //loadDB

    function beginActivity() {
        cardState = 0;
        var color1 = colorArray[Math.floor(Math.random() * colorArray.length)];
        $("#cardArea").empty();
        $("#cardArea").append('<div id="card-front" class="card">' + qbank[currentQuestion][0] + '</div>');
        $("#cardArea").append('<div id="card-back" class="card">' + qbank[currentQuestion][1] + '</div>');
        $("#card-front").css("background-color", color1);
        $("#card-back").css("background-color", "#34495E");
        $("#card-back").css("top", "200px");
        $("#cardArea").on("click", function() {
            if (cardState != 1) {
                cardState = 1;
                //togglePosition();
                $("#card-front").animate({
                    top: "-=200"
                }, 150, function() {
                    cardState = 0;
                    togglePosition();
                });
                $("#card-back").animate({
                    top: "-=200"
                }, 150, function() {
                    togglePosition2();
                });
            } //if
        }); //click function
        currentQuestion++;
        $("#buttonArea").empty();
        $("#buttonArea").append('<div id="nextButton">הכרטיסיה הבאה</div>');
        $("#nextButton").on("click", function() {
            if (currentQuestion < qbank.length) {
                beginActivity();
            } else {
                displayFinalMessage();
            }
        }); //click function
    } //beginactivity

    function togglePosition() {
        if ($("#card-front").position().top == -200) {
            $("#card-front").css("top", "200px");
        };
    } //toggle

    function togglePosition2() {
        if ($("#card-back").position().top == -200) {
            $("#card-back").css("top", "200px");
        };
    } //toggle2

    function displayFinalMessage() {
        $("#buttonArea").empty();
        $("#cardArea").empty();
        $("#cardArea").append('<div id="finalMessage">סיימת!</div>');
    } //final message

});