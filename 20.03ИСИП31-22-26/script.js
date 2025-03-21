async function loadPyodideAndRun() {
    window.pyodide = await loadPyodide();
}

loadPyodideAndRun();

async function runPython() {
    let code = document.getElementById("code").value;
    let output = document.getElementById("output");

    output.textContent = "Выполнение...";

    try {
        let pyodide = window.pyodide;
        
        // Перехватываем вывод print()
        let capture_stdout = `
import sys
from io import StringIO

stdout_capture = StringIO()
sys.stdout = stdout_capture

try:
    exec(__code__)
    sys.stdout = sys.__stdout__
    result = stdout_capture.getvalue()
except Exception as e:
    sys.stdout = sys.__stdout__
    result = str(e)

result
`;

        let result = await pyodide.runPythonAsync(capture_stdout.replace("__code__", JSON.stringify(code)));

        output.textContent = result ? result : "Код выполнен без вывода.";
    } catch (e) {
        output.textContent = "Ошибка: " + e.toString();
    }
}

function checkQuiz() {
    let answers = {
        q1: "b",
        q2: "c",
        q3: "a",
        q4: "c",
        q5: "b"
    };
    
    let score = 0;
    let totalQuestions = Object.keys(answers).length;

    for (let key in answers) {
        let answer = document.querySelector(`input[name="${key}"]:checked`);
        if (answer && answer.value === answers[key]) {
            score++;
        }
    }

    document.getElementById("result").innerText = `Вы правильно ответили на ${score} из ${totalQuestions} вопросов.`;
}


// Обработчик проверки ответов в тесте
document.addEventListener("DOMContentLoaded", function() {
    const quizForm = document.getElementById("quiz-form");
    if (quizForm) {
        quizForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            let score = 0;
            const answers = {
                "q1": "A",
                "q2": "B",
                "q3": "C"
            };

            const formData = new FormData(quizForm);
            formData.forEach((value, key) => {
                const question = document.querySelector(`label[for='${key}_${value}']`);
                if (question) {
                    if (value === answers[key]) {
                        question.classList.add("correct");
                        question.classList.remove("incorrect");
                        score++;
                    } else {
                        question.classList.add("incorrect");
                        question.classList.remove("correct");
                    }
                }
            });

            const result = document.getElementById("quiz-result");
            if (result) {
                result.innerHTML = `Вы набрали ${score} из ${Object.keys(answers).length}`;
                result.style.fontWeight = "bold";
            }
        });
    }
});
