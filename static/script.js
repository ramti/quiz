function renderQuiz(num_questions, source, topic) {
    let data = {}

    if (num_questions != -1) {
        data.num = num_questions;
    }

    if (source != -1) {
        data.source = source;
    }

    if (topic != -1) {
        data.topic = topic;
    }

    $.getJSON("questions", data,
    function(data) {
        let questions = data;
        $('#quiz').quiz({
          //resultsScreen: '#results-screen',
          counter: true,
          //homeButton: '#custom-home',
          counterFormat: 'שאלה %current מתוך %total',
          questions: questions
        });
    });
}

function load_sources() {
    $.getJSON("sources",
    function(sources) {
        var $dropdown = $("#select-source");
        // Remove all the options
        $dropdown.find('option').remove();

        $dropdown.append($("<option />").val('-1').text('הכל'));
        $.each(sources, function() {
            $dropdown.append($("<option />").val(this).text(this));
        });
    });
}

function load_topics() {
    $.getJSON("topics",
    function(sources) {
        var $dropdown = $("#select-topic");
        // Remove all the options
        $dropdown.find('option').remove();

        $dropdown.append($("<option />").val('-1').text('הכל'));
        $.each(sources, function() {
            $dropdown.append($("<option />").val(this).text(this));
        });
    });
}

$("#quiz-render-btn").click(function () {
    num_questions = $("#select-num-questions").val();
    source = $("#select-source").val();
    topic = $("#select-topic").val();

    renderQuiz(num_questions, source, topic);

    $("#quiz").show();
    $("#quiz-config").hide();
})

load_sources();
load_topics();