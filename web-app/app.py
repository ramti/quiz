from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route('/')
def quiz():
    return render_template("quiz.html")


app.run()
