from dataclasses import dataclass
from typing import Optional


@dataclass
class Subject:
    name: str
    display_name: str
    question_db: str
    cards_db: Optional[str]
    allow_reorder: bool = False


SUBJECTS = [
    Subject(name="bio1", display_name="מבוא לביולוגיה א'", question_db="data/questions-bio1.csv",
            cards_db="data/cards-bio1.csv"),
    Subject(name="bio2", display_name="מבוא לביולוגיה ב'", question_db="data/questions-bio2.csv",
            cards_db="data/cards-bio2.csv"),
    Subject(name="bio3", display_name="מבוא לביולוגיה ג'", question_db="data/questions-bio3.csv",
            cards_db="data/cards-bio3.csv", allow_reorder=True),
    Subject(name="biocell", display_name="ביולוגיה של התא", question_db="data/questions-biocell.csv",
            cards_db=None, allow_reorder=True)
]

SUBJECTS_BY_NAME = {subject.name: subject for subject in SUBJECTS}
