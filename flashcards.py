import sqlite3

def add_flashcard(word, translation, examples=''):
    conn = sqlite3.connect('flashcards.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS flashcards
                      (word TEXT, translation TEXT, examples TEXT)''')
    cursor.execute("INSERT INTO flashcards (word, translation, examples) VALUES (?, ?, ?)",
                   (word, translation, examples))
    conn.commit()
    conn.close()

def get_flashcards():
    conn = sqlite3.connect('flashcards.db')
    cursor = conn.cursor()
    cursor.execute("SELECT word, translation, examples FROM flashcards")
    flashcards = cursor.fetchall()
    conn.close()
    return flashcards