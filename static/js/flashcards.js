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

        $("#flashcard-area").empty();
        let html = '<input id="flashcard-1" type="checkbox" /><label for="flashcard-1">';
        html += '<section class="front" id="front">' + qbank[currentQuestion][0] + '</section>';
        html += '<section class="back" id="back">' + qbank[currentQuestion][1] + '</section>';
        html += '</label>';
        $("#flashcard-area").html(html);

//        $("#front").css("background-color", color1);
        $("#back").css("background-color", "#34495E");
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

    function displayFinalMessage() {
        $("#buttonArea").empty();
        $("#cardArea").empty();
        $("#cardArea").append('<div id="finalMessage">סיימת!</div>');
    } //final message

});