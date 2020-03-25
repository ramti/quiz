import random
from flask import Flask
from flask import render_template, json, request
from subjects import SUBJECTS_BY_NAME

import questions
import cards

app = Flask(__name__)


def my_render_template(*args, **kwargs):
    return render_template(*args, **kwargs, token=random.randint(0, 100))


def render_subject(subject, *args, **kwargs):
    return my_render_template("quiz.html",
                              subject=subject,
                              display_name=SUBJECTS_BY_NAME[subject].display_name,
                              *args,
                              **kwargs)


@app.route('/')
def quiz():
    return my_render_template("home.html")


@app.route('/bio1')
def bio1():
    return render_subject("bio1")


@app.route('/bio2')
def bio2():
    return render_subject("bio2")


@app.route('/bio3')
def bio3():
    # return my_render_template("construction.html")
    return render_subject("bio3")


@app.route('/flashcards')
def flashcards():
    return my_render_template("flashcards.html")


@app.route('/questions')
def get_questions():
    subject = request.args.get('subject')
    num_questions = request.args.get('num')
    source = request.args.get('source')
    topic = request.args.get('topic')

    if num_questions is not None:
        num_questions = int(num_questions)

    return json.dumps(questions.get_questions(subject, num_questions, source, topic))


@app.route('/cards')
def get_cards():
    return json.dumps(cards.get_cards('bio1', -1))



@app.route('/sources')
def get_sources():
    subject = request.args.get('subject')
    return json.dumps(questions.get_sources(subject))


@app.route('/topics')
def get_topics():
    subject = request.args.get('subject')
    return json.dumps(questions.get_topics(subject))


questions.load_questions()
cards.load_cards()

if __name__ == "__main__":
    app.run()
