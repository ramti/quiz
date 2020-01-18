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
    if num_questions is None:
        num_questions = -1
    else:
        num_questions = int(num_questions)

    return json.dumps(questions.get_questions(num_questions))


if __name__ == "__main__":
    questions.load_questions()
    app.run()
