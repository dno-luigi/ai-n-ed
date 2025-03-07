document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'liquid/lfm-7b',
                messages: [{ role: 'user', content: query }],
                top_p: 1,
                temperature: 0.5,
                frequency_penalty: 0,
                presence_penalty: 0,
                repetition_penalty: 1,
                top_k: 0
            })
        });

        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <h2>answer</h2>
            <p>${data.choices[0].message.content}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p>an error occurred while fetching results.</p>';
    }
    
    
    document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('search-query').value;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': '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' // Replace YOUR_API_KEY with your actual API key
            },
            body: JSON.stringify({
                model: 'perplexity/llama-3.1-sonar-small-128k-online',
                messages: [{ role: 'user', content: query }],
                top_p: 1,
                temperature: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                repetition_penalty: 1,
                top_k: 0
            })
        });

        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <h2>answer</h2>
            <p>${data.choices[0].message.content}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p>an error occurred while fetching results.</p>';
    }
});

// Add follow-up question handling
document.getElementById('follow-up-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const followUpQuery = document.getElementById('follow-up-query').value;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': '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' // Replace YOUR_API_KEY with your actual API key
            },
            body: JSON.stringify({
                model: 'perplexity/llama-3.1-sonar-small-128k-online',
                messages: [{ role: 'user', content: followUpQuery }],
                top_p: 1,
                temperature: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                repetition_penalty: 1,
                top_k: 0
            })
        });

        const data = await response.json();
        const followUpResultsDiv = document.getElementById('follow-up-results');
        followUpResultsDiv.innerHTML = `
            <h2>follow-up answer</h2>
            <p>${data.choices[0].message.content}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('follow-up-results').innerHTML = '<p>an error occurred while fetching results.</p>';
    }
});
});
