function renderQuiz(num_questions) {
    $.getJSON("questions", {num: num_questions},
    function( data ) {
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

$("#quiz-render-btn").click(function () {
    renderQuiz($("#select-num-questions").val());
    $("#quiz").show();
    $("#quiz-config").hide();
})