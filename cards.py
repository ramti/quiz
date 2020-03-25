import random
import os

from subjects import SUBJECTS_BY_NAME
import cards_loader


subjects_db = {}


def load_cards():
    global subjects_db
    for subject_data in SUBJECTS_BY_NAME.values():
        module_dir = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(module_dir, subject_data.cards_db)
        csv_data = cards_loader.read_csv(file_path)

        loader = cards_loader.CardsLoader(csv_data)
        loader.analyze()
        print(f"Subject {subject_data.name}: loaded {len(loader.get_cards())} cards")
        subjects_db[subject_data.name] = loader


def get_cards(subject, num_questions, source=None, topic=None):
    loader = subjects_db[subject]
    cards_objs = loader.get_cards()[:]

    if source is not None:
        cards_objs = [obj for obj in cards_objs if obj.source == source]

    if topic is not None:
        cards_objs = [obj for obj in cards_objs if obj.topic == topic]
    random.shuffle(cards_objs)

    if num_questions != -1:
        cards_objs = cards_objs[:num_questions]

    return loader.export_web_quiz(cards_objs)


def get_sources(subject):
    return subjects_db[subject].get_sources()


def get_topics(subject):
    return subjects_db[subject].get_topics()
