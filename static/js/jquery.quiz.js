;(function($, window, document, undefined) {

  'use strict';


  $.quiz = function(el, options) {
    var base = this;

    // Access to jQuery version of element
    base.$el = $(el);

    // Add a reverse reference to the DOM object
    base.$el.data('quiz', base);

    base.options = $.extend($.quiz.defaultOptions, options);

    var questions = base.options.questions,
      numQuestions = questions.length,
      startScreen = base.options.startScreen,
      startButton = base.options.startButton,
      homeButton = base.options.homeButton,
      resultsScreen = base.options.resultsScreen,
      gameOverScreen = base.options.gameOverScreen,
      nextButtonText = base.options.nextButtonText,
      finishButtonText = base.options.finishButtonText,
      restartButtonText = base.options.restartButtonText,
      currentQuestion = 1,
      score = 0,
      answerLocked = false;

    base.methods = {
      init: function() {
        base.methods.setup();

        $(document).on('click', startButton, function(e) {
          e.preventDefault();
          base.methods.start();
        });

        $(document).on('click', homeButton, function(e) {
          e.preventDefault();
          base.methods.home();
        });

        $(document).on('click', '.answers a', function(e) {
          e.preventDefault();
          base.methods.answerQuestion(this);
        });

        $(document).on('click', '#quiz-next-btn', function(e) {
          e.preventDefault();
          base.methods.nextQuestion();
        });

        $(document).on('click', '#quiz-finish-btn', function(e) {
          e.preventDefault();
          base.methods.finish();
        });

        $(document).on('click', '#quiz-restart-btn, #quiz-retry-btn', function(e) {
          e.preventDefault();
          base.methods.restart();
        });
      },
      setup: function() {
        var quizHtml = '';

        if (base.options.counter) {
          quizHtml += '<div id="quiz-counter"></div>';
        }

        quizHtml += '<div id="questions">';
        $.each(questions, function(i, question) {
            let display_name = $('#data-display-name').html()
            let q_source = display_name + ' - ' + question.source;
            let bad_q_link = "https://docs.google.com/forms/d/e/1FAIpQLSdikza19-lYxo5I8eiDu3J80go6DxDFrYbTijmmSGWYVteAdA/viewform?usp=pp_url&entry.1198196845=" + encodeURI(question.q) + "&entry.2023241873=" + encodeURI(q_source);
          quizHtml += '<div class="question-container">';
          quizHtml += '<div id="quiz-q-info"><span class="q-source">' + question.source + '</span>';
          quizHtml += '<span class="q-topic">' + question.topic + '</span></div>';

          if (question.img_link != "") {
            quizHtml += '<img class="img_link" src="' + question.img_link + '" />';
          }

          quizHtml += '<p class="question">' + question.q + '</p>';
          quizHtml += '<ul class="answers">';
          $.each(question.options, function(index, answer) {
            quizHtml += '<li><a href="#" data-index="' + index + '">' + answer + '</a></li>';
          });
          quizHtml += '</ul>';
          quizHtml += '<div id="quiz-bad-question"><a href="' + bad_q_link + '" target="_blank" class="quiz-btn">בעיה בשאלה</a></div>'
          quizHtml += '</div>';
        });
        quizHtml += '</div>';

        // if results screen not in DOM, add it
        if ($(resultsScreen).length === 0) {
          quizHtml += '<div id="' + resultsScreen.substr(1) + '">';
          quizHtml += '<p id="quiz-results"></p>';
          quizHtml += '</div>';
        }

        quizHtml += '<div id="quiz-controls">';
        quizHtml += '<p id="quiz-response"></p>';
        quizHtml += '<div id="quiz-buttons">';
        quizHtml += '<a href="#" id="quiz-next-btn">' + nextButtonText + '</a>';
        quizHtml += '<a href="#" id="quiz-finish-btn">' + finishButtonText + '</a>';
        quizHtml += '<a href="#" id="quiz-restart-btn">' + restartButtonText + '</a>';
        quizHtml += '</div>';
        quizHtml += '</div>';

        base.$el.append(quizHtml).addClass('quiz-container quiz-start-state');

        $('#quiz-counter').hide();
        $('.question-container').hide();
        $(gameOverScreen).hide();
        $(resultsScreen).hide();
        $('#quiz-controls').hide();
      },
      start: function() {
        base.$el.removeClass('quiz-start-state').addClass('quiz-questions-state');
        $(startScreen).hide();
        $('#quiz-controls').hide();
        $('#quiz-finish-btn').hide();
        $('#quiz-restart-btn').hide();
        $('#questions').show();
        $('#quiz-counter').show();
        $('.question-container:first-child').show().addClass('active-question');
        base.methods.updateCounter();
      },
      answerQuestion: function(answerEl) {
        if (answerLocked) {
          return;
        }
        answerLocked = true;

        var $answerEl = $(answerEl),
          response = '',
          selected = $answerEl.data('index'),
          currentQuestionIndex = currentQuestion - 1,
          correct = questions[currentQuestionIndex].correctIndex;

        if (selected === correct) {
          $answerEl.addClass('correct');
          response = questions[currentQuestionIndex].correctResponse;
          saveCorrectQuestion(questions[currentQuestionIndex].q);
          score++;
        } else {
          $answerEl.addClass('incorrect');
          response = questions[currentQuestionIndex].incorrectResponse;
          if (!base.options.allowIncorrect) {
            base.methods.gameOver(response);
            return;
          }
        }

        $('#quiz-response').html(response);
        $('#quiz-controls').fadeIn();

        if (typeof base.options.answerCallback === 'function') {
          base.options.answerCallback(currentQuestion, selected, questions[currentQuestionIndex]);
        }
      },
      nextQuestion: function() {
        answerLocked = false;

        $('.active-question')
          .hide()
          .removeClass('active-question')
          .next('.question-container')
          .show()
          .addClass('active-question');

        $('#quiz-controls').hide();

        // check to see if we are at the last question
        if (++currentQuestion === numQuestions) {
          $('#quiz-next-btn').hide();
          $('#quiz-finish-btn').show();
        }

        base.methods.updateCounter();

        if (typeof base.options.nextCallback === 'function') {
          base.options.nextCallback();
        }
      },
      gameOver: function(response) {
        // if gameover screen not in DOM, add it
        if ($(gameOverScreen).length === 0) {
          var quizHtml = '';
          quizHtml += '<div id="' + gameOverScreen.substr(1) + '">';
          quizHtml += '<p id="quiz-gameover-response"></p>';
          quizHtml += '<p><a href="#" id="quiz-retry-btn">' + restartButtonText + '</a></p>';
          quizHtml += '</div>';
          base.$el.append(quizHtml);
        }
        $('#quiz-gameover-response').html(response);
        $('#quiz-counter').hide();
        $('#questions').hide();
        $('#quiz-finish-btn').hide();
        $(gameOverScreen).show();
      },
      finish: function() {
        base.$el.removeClass('quiz-questions-state').addClass('quiz-results-state');
        $('.active-question').hide().removeClass('active-question');
        $('#quiz-counter').hide();
        $('#quiz-response').hide();
        $('#quiz-finish-btn').hide();
        $('#quiz-next-btn').hide();
        $('#quiz-restart-btn').show();
        $(resultsScreen).show();
        var resultsStr = base.options.resultsFormat.replace('%score', score).replace('%total', numQuestions);
        $('#quiz-results').html(resultsStr);

        if (typeof base.options.finishCallback === 'function') {
          base.options.finishCallback();
        }
      },
      restart: function() {
        base.methods.reset();
        base.$el.addClass('quiz-questions-state');
        $('#questions').show();
        $('#quiz-counter').show();
        $('.question-container:first-child').show().addClass('active-question');
        base.methods.updateCounter();
      },
      reset: function() {
        answerLocked = false;
        currentQuestion = 1;
        score = 0;
        $('.answers a').removeClass('correct incorrect');
        base.$el.removeClass().addClass('quiz-container');
        $('#quiz-restart-btn').hide();
        $(gameOverScreen).hide();
        $(resultsScreen).hide();
        $('#quiz-controls').hide();
        $('#quiz-response').show();
        $('#quiz-next-btn').show();
        $('#quiz-counter').hide();
        $('.active-question').hide().removeClass('active-question');
      },
      home: function() {
        base.methods.reset();
        base.$el.addClass('quiz-start-state');
        $(startScreen).show();

        if (typeof base.options.homeCallback === 'function') {
          base.options.homeCallback();
        }
      },
      updateCounter: function() {
        var countStr = base.options.counterFormat.replace('%current', currentQuestion).replace('%total', numQuestions);
        $('#quiz-counter').html(countStr);
      }
    };

    base.methods.init();
  };

  $.quiz.defaultOptions = {
    allowIncorrect: true,
    counter: true,
    counterFormat: '%current/%total',
    startScreen: '#quiz-start-screen',
    startButton: '#quiz-start-btn',
    homeButton: '#quiz-home-btn',
    resultsScreen: '#quiz-results-screen',
    resultsFormat: 'You got %score out of %total correct!',
    gameOverScreen: '#quiz-gameover-screen',
    nextButtonText: 'Next',
    finishButtonText: 'Finish',
    restartButtonText: 'Restart'
  };

  $.fn.quiz = function(options) {
    return this.each(function() {
      new $.quiz(this, options);
    });
  };
}(jQuery, window, document));

function saveCorrectQuestion(question) {
    var solvedQuestions = JSON.parse(localStorage.getItem("bioQuizSolvedQuestions"));
    if (!solvedQuestions) {
        solvedQuestions = [];
    }
    solvedQuestions.push(question);
    localStorage.setItem("bioQuizSolvedQuestions", JSON.stringify(solvedQuestions));
}

function filterQuestions(questions, show_only_unsolved) {
    var new_questions = questions.slice();
    if (show_only_unsolved) {
        var solvedQuestions = JSON.parse(localStorage.getItem("bioQuizSolvedQuestions"));
        if (!solvedQuestions) {
            solvedQuestions = [];
        }
        console.log(solvedQuestions);
        var temp_arr = new_questions.filter(function(item) {
            return !solvedQuestions.includes(item.q);
        });
        new_questions = temp_arr;
    }
    return new_questions;
}

function renderQuiz(num_questions, source, topic, show_only_unsolved) {
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
        let questions = filterQuestions(data, show_only_unsolved);
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


$("#quiz-render-btn").click(function () {
    num_questions = $("#select-num-questions").val();
    source = $("#select-source").val();
    topic = $("#select-topic").val();
    show_only_unsolved = $('#quiz-show-only-unsolved').prop('checked');

    renderQuiz(num_questions, source, topic, show_only_unsolved);

    $("#quiz").show();
    $("#quiz-config").hide();
})

$("#quiz-clear-solved-questions").click(function () {
    if (confirm('בדוק?')) {
        localStorage.setItem("bioQuizSolvedQuestions", JSON.stringify([]));
        $("#quiz-clear-solved-questions").css('background-color', '#9e9e9e');
    }
})


