async function readArticle() {
    const articleInput = document.getElementById("articleInput").value;
    localStorage.setItem('articleContent', articleInput);  // Save the article content
    const response = await fetch('/process_article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article: articleInput }),
    });
    const data = await response.json();
    displayArticle(data.article);
}

function displayArticle(article) {
    const articleOutput = document.getElementById("articleOutput");
    articleOutput.innerHTML = "";

    const paragraphs = article.split('\n');
    paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        const words = paragraph.split(' ');
        words.forEach(word => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.onmouseover = (event) => showPopup(word, event);
            span.onmouseout = () => hidePopup();
            p.appendChild(span);
        });
        articleOutput.appendChild(p);
    });
}

function restoreArticle() {
    const savedArticle = localStorage.getItem('articleContent');
    if (savedArticle) {
        document.getElementById('articleInput').value = savedArticle;
        displayArticle(savedArticle);
    }
}

async function showPopup(word, event) {
    const response = await fetch(`/translate_word?word=${word}`);
    const data = await response.json();
    const popup = document.getElementById("popup");
    document.getElementById("popupWord").textContent = `Word: ${word}`;
    document.getElementById("popupTranslation").textContent = `Translation: ${data.translation}`;
    
    const rect = event.target.getBoundingClientRect();
    const popupWidth = 300; // Width of the popup
    const popupHeight = popup.offsetHeight; // Height of the popup

    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;

    // Adjust position if the popup goes off the screen
    if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 10; // 10px padding from the right edge
    }

    if (top + popupHeight > window.innerHeight) {
        top = rect.top + window.scrollY - popupHeight - 10; // 10px padding from the bottom edge
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.display = 'block';

    document.getElementById("addToFlashcards").onclick = () => addToFlashcards(word, data.translation);
    popup.onmouseover = () => popup.style.display = 'block';
    popup.onmouseout = () => hidePopup();
    event.target.onmouseout = () => hidePopup();
}

function hidePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = 'none';
}

async function addToFlashcards(word, translation) {
    await fetch('/add_to_flashcards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, translation }),
    });
}

function viewFlashcards() {
    window.location.href = '/flashcards';
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Restore article and theme on page load
window.onload = function() {
    restoreArticle();
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
}