import random
import os

import questions_loader


QUESTION_FILE_PATH = "./data/questions.csv"

loader = None


def load_questions():
    global loader
    module_dir = os.path.abspath(os.path.dirname(__file__))
    file_path = os.path.join(module_dir, QUESTION_FILE_PATH)
    csv_data = questions_loader.read_csv(file_path)
    loader = questions_loader.QuestionsLoader(csv_data)
    loader.analyze()


def get_questions(num_questions, source=None, topic=None):
    questions_objs = loader.get_questions()[:]

    if source is not None:
        questions_objs = [obj for obj in questions_objs if obj.source == source]

    if topic is not None:
        questions_objs = [obj for obj in questions_objs if obj.topic == topic]

    random.shuffle(questions_objs)

    if num_questions != -1:
        questions_objs = questions_objs[:num_questions]

    return loader.export_web_quiz(questions_objs)


def get_sources():
    return loader.get_sources()


def get_topics():
    return loader.get_topics()
