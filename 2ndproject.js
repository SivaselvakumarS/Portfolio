const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value.trim(); // Trim any leading/trailing whitespaces
    if (inpWord === "") {
        result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        return; // Exit function early if input is empty
    }
    
    fetch(`${url}${inpWord}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Couldn't find the word"); // Throw an error for non-successful response
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                throw new Error("No definition found");
            }
            renderResult(data[0], inpWord);
        })
        .catch((error) => {
            console.error("Error:", error); // Log the error for debugging
            result.innerHTML = `<h3 class="error">${error.message}</h3>`;
        });
});

function renderResult(data, word) {
    result.innerHTML = `
        <div class="word">
            <h3>${word}</h3>
            <button onclick="playSound('${word}')" class="audio-btn">
                <i class="fas fa-volume-up"></i>
            </button>
        </div>
        <div class="details">
            <p>${data.meanings[0].partOfSpeech}</p>
            <p>/${data.phonetic}/</p>
        </div>
        <p class="word-meaning">
            ${data.meanings[0].definitions[0].definition}
        </p>
        <p class="word-example">
            ${data.meanings[0].definitions[0].example || ""}
        </p>`;
    
    // Set the audio source if available
    if (data.phonetics && data.phonetics[0] && data.phonetics[0].audio) {
        const sound = document.getElementById("sound");
        sound.setAttribute("src", `https:${data.phonetics[0].audio}`);
    }
}

function playSound(word) {
    const speech = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(speech);
}
