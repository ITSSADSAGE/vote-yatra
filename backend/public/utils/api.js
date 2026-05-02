const API_URL = 'http://localhost:3000/api';

export async function fetchGuide(userData) {
    const response = await fetch(`${API_URL}/guide`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return response.json();
}
