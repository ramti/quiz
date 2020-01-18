import json
import random
import os

QUESTION_FILE_PATH = "./data/questions.json"

questions_db = []


def load_questions():
    global questions_db
    module_dir = os.path.abspath(os.path.dirname(__file__))
    file_path = os.path.join(module_dir, QUESTION_FILE_PATH)
    with open(file_path, "r") as handle:
        questions_db = json.load(handle)


def get_questions(num_questions):
    questions = questions_db[:]
    random.shuffle(questions)

    if num_questions == -1:
        return questions
    return questions[:num_questions]