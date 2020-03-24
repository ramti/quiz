let data_subject = $('#data_subject').text();

function renderQuiz(num_questions, source, topic) {
    let data = {"subject": data_subject}

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
            resultsFormat: 'הצלחת %score שאלות מתוך %total!',
            nextButtonText: 'הבא',
            finishButtonText: 'סיום',
            restartButtonText: 'התחלה מחדש',
            counter: true,
            counterFormat: 'שאלה %current מתוך %total',
            questions: questions
        });
    });
}

function load_sources() {
    let data = {"subject": data_subject};

    $.getJSON("sources", data,
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
    let data = {"subject": data_subject};

    $.getJSON("topics", data,
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
//
//renderQuiz(2, -1, -1);
//
//$("#quiz").show();
//$("#quiz-config").hide();