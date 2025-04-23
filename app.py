from flask import Flask, render_template, url_for
# from data.letters import LETTERS
from data.expressions import EXPRESSIONS

app = Flask(__name__)

# Remove the local redefinition:
LETTERS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


@app.route('/')
def home():
    return render_template('home.html', page='home', title='Home')

@app.route('/about')
def about():
    return render_template('about.html', page='about', title='About')

@app.route('/lessons')
def lessons():
    return render_template('lessons.html', page='lessons', title='Lessons')

@app.route('/lessons/alphabet')
def lesson_alphabet():
    return render_template(
        'lessons_alphabet.html',
        page='lesson-alphabet',
        title='Lesson 1 – Alphabet',
        items=LETTERS
    )

@app.route('/lessons/expressions')
def lesson_expressions():
    return render_template(
        'lessons_expressions.html',
        page='lesson-expressions',
        title='Lesson 2 – Expressions',
        items=EXPRESSIONS
    )

@app.route('/quiz')
def quiz():
    return render_template('quiz.html', page='quiz', title='Quiz')

@app.route('/quiz/alphabet')
def quiz_alphabet():
    return render_template(
        'quiz_alphabet.html',
        page='quiz-alphabet',
        title='Quiz 1 – Alphabet',
        items=LETTERS
    )

@app.route('/quiz/expressions')
def quiz_expressions():
    return render_template(
        'quiz_expressions.html',
        page='quiz-expressions',
        title='Quiz 2 – Expressions',
        items=EXPRESSIONS
    )

if __name__ == '__main__':
    app.run(debug=True)
