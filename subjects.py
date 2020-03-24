from dataclasses import dataclass


@dataclass
class Subject:
    name: str
    display_name: str
    question_db: str


SUBJECTS = [
    Subject(name="bio1", display_name="מבוא לביולוגיה א'", question_db="data/questions.csv"),
    Subject(name="bio2", display_name="מבוא לביולוגיה ב'", question_db="data/questions.csv"),
    Subject(name="bio3", display_name="מבוא לביולוגיה ג'", question_db="data/questions.csv")
]

SUBJECTS_BY_NAME = {subject.name: subject for subject in SUBJECTS}
