import random
import os

from subjects import SUBJECTS_BY_NAME
import questions_loader


subjects_db = {}


def load_questions():
    global subjects_db
    for subject_data in SUBJECTS_BY_NAME.values():
        if not subject_data.question_db:
            continue

        module_dir = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(module_dir, subject_data.question_db)
        csv_data = questions_loader.read_csv(file_path)

        loader = questions_loader.QuestionsLoader(csv_data, allow_reoder=subject_data.allow_reorder)
        loader.analyze()
        print(f"Subject {subject_data.name}: loaded {len(loader.get_questions())} questions")
        subjects_db[subject_data.name] = loader


def get_questions(subject, num_questions, source=None, topic=None):
    loader = subjects_db[subject]
    questions_objs = loader.get_questions()[:]

    if source is not None:
        questions_objs = [obj for obj in questions_objs if obj.source == source]

    if topic is not None:
        questions_objs = [obj for obj in questions_objs if obj.topic == topic]
    random.shuffle(questions_objs)

    if num_questions != -1:
        questions_objs = questions_objs[:num_questions]

    return loader.export_web_quiz(questions_objs)


def get_sources(subject):
    return subjects_db[subject].get_sources()


def get_topics(subject):
    return subjects_db[subject].get_topics()
