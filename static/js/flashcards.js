let currentQuestion = 0;
let qbank = null;

function beginActivity() {
    $("#flashcard-area").empty();
    let html = '<input id="flashcard-1" type="checkbox" /><label for="flashcard-1">';
    html += '<section class="front" id="front">' + qbank[currentQuestion][0] + '</section>';
    html += '<section class="back" id="back">' + qbank[currentQuestion][1] + '</section>';
    html += '</label>';
    $("#flashcard-area").html(html);

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
    });
}

function displayFinalMessage() {
    $("#buttonArea").empty();
    $("#flashcard-area").fadeOut(500, function() {
        $("#buttonArea").append('<div id="final-message">סיימת!</div>');
    });
}


function renderFlashCards(num_cards, topic) {
    let data = {"subject": data_subject}

    if (num_cards != -1) {
        data.num = num_cards;
    }

    if (topic != -1) {
        data.topic = topic;
    }

    qbank = new Array;
    $.getJSON("cards", data,
        function(data) {
            for (i = 0; i < data.questionlist.length; i++) {
                qbank[i] = [];
                qbank[i][0] = data.questionlist[i].cardfront;
                qbank[i][1] = data.questionlist[i].cardback;
            }
            currentQuestion = 0;
            beginActivity();
        });
}


$("#cards-render-btn").click(function () {
    num_cards = $("#select-num-cards").val();
    topic = $("#select-topic").val();

    $("#buttonArea").hide();
    renderFlashCards(num_cards, topic);

    $("#cards-config").fadeOut(500, function() {
        $("#buttonArea").fadeIn(500);
        $("#flashcard-area").fadeIn(500);
    });
})
