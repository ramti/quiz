from flask import Flask
from flask import render_template, json, request

import questions

app = Flask(__name__)


@app.route('/')
def quiz():
    return render_template("quiz.html")


@app.route('/questions')
def get_questions():
    num_questions = request.args.get('num')
    source = request.args.get('source')
    topic = request.args.get('topic')

    if num_questions is not None:
        num_questions = int(num_questions)

    return json.dumps(questions.get_questions(num_questions, source, topic))


@app.route('/sources')
def get_sources():
    return json.dumps(questions.get_sources())


@app.route('/topics')
def get_topics():
    return json.dumps(questions.get_topics())


if __name__ == "__main__":
    questions.load_questions()
    app.run()
