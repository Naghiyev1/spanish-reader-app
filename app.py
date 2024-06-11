from flask import Flask, render_template, request, jsonify
import json
import sqlite3
from flashcards import add_flashcard, get_flashcards
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_article', methods=['POST'])
def process_article():
    data = request.get_json()
    article = data['article']
    return jsonify({"article": article})

@app.route('/translate_word')
def translate_word():
    word = request.args.get('word')
    translation = translator.translate(word, src='es', dest='en').text
    return jsonify({"translation": translation})

@app.route('/add_to_flashcards', methods=['POST'])
def add_to_flashcards():
    data = request.get_json()
    add_flashcard(data['word'], data['translation'], '')
    return '', 204

@app.route('/flashcards', methods=['GET'])
def flashcards():
    flashcards = get_flashcards()
    return render_template('flashcards.html', flashcards=flashcards)

if __name__ == '__main__':
    app.run(debug=True, port=5001)