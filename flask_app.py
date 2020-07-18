import random
from flask import Flask
from flask import render_template, json, request, abort
from subjects import SUBJECTS_BY_NAME

import questions
import cards

app = Flask(__name__)

CONSTRUCTION = []


def my_render_template(*args, **kwargs):
    return render_template(*args, **kwargs, token=random.randint(0, 100))


@app.route('/')
def home():
    return my_render_template("home.html")


@app.route('/quiz/<subject>')
def quiz(subject):
    if subject in CONSTRUCTION:
        return my_render_template("construction.html")

    if subject not in SUBJECTS_BY_NAME.keys():
        abort(404)

    return my_render_template("quiz.html",
                              subject=subject,
                              display_name=SUBJECTS_BY_NAME[subject].display_name)


@app.route('/quiz/questions')
def get_quiz_questions():
    subject = request.args.get('subject')
    num_questions = request.args.get('num')
    sources = request.args.getlist('source')
    topics = request.args.getlist('topic')

    if num_questions is not None:
        num_questions = int(num_questions)

    return json.dumps(questions.get_questions(subject, num_questions, sources=sources, topics=topics))


@app.route('/quiz/sources')
def get_quiz_sources():
    subject = request.args.get('subject')
    return json.dumps(sorted(questions.get_sources(subject)))


@app.route('/quiz/topics')
def get_quiz_topics():
    subject = request.args.get('subject')
    return json.dumps(sorted(questions.get_topics(subject)))


@app.route('/flash/<subject>')
def flashcards(subject):
    if subject in CONSTRUCTION:
        return my_render_template("construction.html")

    if subject not in SUBJECTS_BY_NAME.keys():
        abort(404)

    return my_render_template("flashcards.html",
                              subject=subject,
                              display_name=SUBJECTS_BY_NAME[subject].display_name)


@app.route('/flash/topics')
def get_flash_topics():
    subject = request.args.get('subject')
    return json.dumps(cards.get_topics(subject))


@app.route('/flash/cards')
def get_flash_cards():
    subject = request.args.get('subject')
    topic = request.args.get('topic')
    num_cards = request.args.get('num')

    if num_cards is not None:
        num_cards = int(num_cards)

    return json.dumps(cards.get_cards(subject, num_cards, topic=topic))


questions.load_questions()
cards.load_cards()

if __name__ == "__main__":
    app.run()
