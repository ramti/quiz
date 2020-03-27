import csv
from dataclasses import dataclass

COL_HEB = 0
COL_ENG = 1
COL_ANSWER = 2
COL_TOPIC = 3

NO_TOPIC = "- ללא נושא -"


@dataclass
class Card:
    heb: str
    eng: str
    answer: str
    topic: str

    def serialize_web(self):
        if not self.heb and not self.eng:
            return {}
        elif self.heb and self.eng:
            card_front = f"{self.heb}<br />({self.eng})"
        elif self.heb:
            card_front = self.heb
        else:
            card_front = self.eng

        data = {'cardfront': card_front, 'cardback': self.answer}
        return data


class CardsLoader:
    def __init__(self, csv_rows):
        self._csv_rows = csv_rows
        self._cards = []
        self._topics = []

    @staticmethod
    def export_web_quiz(questions):
        serialized = [question.serialize_web() for question in questions]
        return {'questionlist': [data for data in serialized if data]}

    def _read_cards(self):
        for row in self._csv_rows:
            topic = row[COL_TOPIC].strip()
            if not topic:
                topic = NO_TOPIC

            card = Card(
                heb=row[COL_HEB].strip(),
                eng=row[COL_ENG].strip(),
                answer=row[COL_ANSWER].strip(),
                topic=topic,
            )

            self._cards.append(card)

    def analyze(self):
        self._read_cards()
        self._topics = sorted(list(set(card.topic for card in self._cards if card.topic)))

    def get_cards(self):
        return self._cards

    def get_topics(self):
        return self._topics


def read_csv(csv_file_path):
    with open(csv_file_path, "r", encoding="utf-8") as handle:
        # Skip the header
        return list(csv.reader(handle))[1:]

