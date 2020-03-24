import argparse
import csv
import random
import json
from dataclasses import dataclass

COL_SOURCE = 0
COL_QUESTION = 1
COL_START_ANS = 2
COL_END_ANS = 7
COL_CORRECT_ANS = 8
COL_TOPIC = 9
COL_COMMENT = 10


@dataclass
class Question:
    source: str
    question: str
    answers: list
    topic: str
    comment: str

    def serialize_txt(self):
        data_lines = [self.question]
        for answer_txt, is_correct in self.answers:
            prefix = "*" if is_correct else "-"
            data_lines.append(f"{prefix}{answer_txt}")
        return "\n".join(data_lines)

    def serialize_web(self):
        correct_index = -1
        answer_txt_list = []
        for i, (answer_txt, is_correct) in enumerate(self.answers):
            if is_correct:
                if correct_index != -1:
                    # More than one correct answer, not supported by the web app
                    return {}
                else:
                    correct_index = i
            answer_txt_list.append(answer_txt)

        # correct_answer_txt = answer_txt_list[correct_index]
        # random.shuffle(answer_txt_list)
        # correct_index = answer_txt_list.index(correct_answer_txt)

        data = {
            'q': self.question,
            'options': answer_txt_list,
            'topic': self.topic,
            'source': self.source,
            'correctIndex': correct_index,
            'correctResponse': 'יפה!',
            'incorrectResponse': f'התשובה הנכונה: {answer_txt_list[correct_index]}'
        }
        return data


class QuestionsLoader:
    def __init__(self, csv_rows):
        self._csv_rows = csv_rows
        self._questions = []
        self._sources = []
        self._topics = []

    @staticmethod
    def export_txt(questions):
        return "\n\n".join(question.serialize_txt() for question in questions)

    @staticmethod
    def export_web_quiz(questions):
        serialized = [question.serialize_web() for question in questions]
        return [data for data in serialized if data]

    def _read_questions(self):
        for row in self._csv_rows:
            question = Question(
                source=row[COL_SOURCE],
                question=row[COL_QUESTION],
                topic=row[COL_TOPIC],
                comment=row[COL_COMMENT],
                answers=list()
            )

            try:
                correct_ans = [int(ans) for ans in row[COL_CORRECT_ANS].split(",")]
                for i, col in enumerate(range(COL_START_ANS, COL_END_ANS + 1)):
                    if row[col]:
                        question.answers.append((row[col], (i + 1) in correct_ans))

                self._questions.append(question)
            except Exception as ex:
                print(f"Error loading question: {ex}")

    def analyze(self):
        self._read_questions()
        self._sources = list(set(question.source for question in self._questions))
        self._topics = sorted(list(set(question.topic for question in self._questions if question.topic)))

    def get_questions(self):
        return self._questions

    def get_sources(self):
        return self._sources

    def get_topics(self):
        return self._topics


def parse_args():
    parser = argparse.ArgumentParser(description="Quiz exporter")
    parser.add_argument("--csv", help="Input CSV file", required=True)
    parser.add_argument("--web", help="Web format output path")
    parser.add_argument("--txt", help="TXT format (Android quiz app) output path")

    args = parser.parse_args()
    if not args.web and not args.txt:
        parser.error("At least one of the arguments 'web' or 'txt' is requires")
    return args


def read_csv(csv_file_path):
    with open(csv_file_path, "r", encoding="utf-8") as handle:
        # Skip the header
        return list(csv.reader(handle))[1:]


def write_output(data, output_file_path):
    with open(output_file_path, "w", encoding="utf-8") as handle:
        handle.write(data)


def main():
    args = parse_args()
    exporter = QuestionsLoader(read_csv(args.csv))
    exporter.analyze()

    if args.txt:
        write_output(exporter.export_txt(exporter.get_questions()), args.txt)

    if args.web:
        write_output(json.dumps(exporter.export_web_quiz(exporter.get_questions()), indent=4), args.web)


if __name__ == "__main__":
    main()