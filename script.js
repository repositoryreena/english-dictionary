document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('input');
    const container = document.querySelector('.container');
    const typeParagraph = document.getElementById('type'); // Select the paragraph by ID

    // Create an element to display the results
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    container.appendChild(resultDiv);

    // Event listener for Enter key press
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const word = input.value.trim();
            if (word) {
                // Hide the paragraph with ID 'type'
                if (typeParagraph) {
                    typeParagraph.style.display = 'none'; // Hide the paragraph
                }
                fetchDefinition(word);
            }
        }
    });

    function fetchDefinition(word) {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Word not found');
                }
                return response.json();
            })
            .then(data => {
                // Clear previous results
                resultDiv.innerHTML = '';

                const entry = data[0];
                const meanings = entry.meanings[0];
                const definition = meanings.definitions[0].definition;
                const pronunciation = entry.phonetic || 'No phonetic spelling available';
                const audioUrl = entry.phonetics.find(p => p.audio)?.audio || '';

                // Create elements to display the results
                const titleElem = document.createElement('p');
                titleElem.innerText = `Word Title: ${word}`;
                resultDiv.appendChild(titleElem);

                const definitionElem = document.createElement('p');
                definitionElem.innerText = `Meaning: ${definition}`;
                resultDiv.appendChild(definitionElem);

                // const pronunciationElem = document.createElement('p');
                // pronunciationElem.innerText = `Pronunciation: ${pronunciation}`;
                // resultDiv.appendChild(pronunciationElem);

                // Create audio element with or without actual audio
                const audioElem = document.createElement('audio');
                audioElem.controls = true;
                if (audioUrl) {
                    const sourceElem = document.createElement('source');
                    sourceElem.src = audioUrl;
                    sourceElem.type = 'audio/mpeg';
                    audioElem.appendChild(sourceElem);
                } else {
                    // Use a 0-second silent audio clip as a fallback
                    const silentAudioBlob = new Blob([new Uint8Array([])], { type: 'audio/mpeg' });
                    const silentAudioUrl = URL.createObjectURL(silentAudioBlob);
                    const sourceElem = document.createElement('source');
                    sourceElem.src = silentAudioUrl;
                    sourceElem.type = 'audio/mpeg';
                    audioElem.appendChild(sourceElem);
                }
                resultDiv.appendChild(audioElem);
            })
            .catch(() => {
                // Clear previous results
                resultDiv.innerHTML = '';

                // Display word title and meaning: N/A
                const titleElem = document.createElement('p');
                titleElem.innerText = `Word Title: ${input.value.trim()}`;
                resultDiv.appendChild(titleElem);

                const definitionElem = document.createElement('p');
                definitionElem.innerText = 'Meaning: N/A';
                resultDiv.appendChild(definitionElem);

                // Hide the paragraph with ID 'type'
                if (typeParagraph) {
                    typeParagraph.style.display = 'none'; // Hide the paragraph
                }
            });
    }
});
