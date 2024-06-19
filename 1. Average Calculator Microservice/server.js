const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9870;

const WINDOW_SIZE = 10;
let windowNumbers = [];

// Fetch numbers from the test server
async function fetchNumbers(qualifier) {
    try {
        const response = await axios.get(`http://20.244.56.144/test/${qualifier}`);
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching numbers for ${qualifier}: ${error.message}`);
        return [];
    }
}

// Calculate average of numbers in the window
function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

// Middleware to handle requests
app.get('/numbers/:qualifier', async (req, res) => {
    const { qualifier } = req.params;
    
    // Fetch numbers from the test server
    const fetchedNumbers = await fetchNumbers(qualifier);
    
    // Check if fetched numbers are valid and within the time limit
    if (fetchedNumbers.length === 0) {
        return res.status(500).send('Error fetching numbers from the test server');
    }

    // Update window numbers
    windowNumbers = [...windowNumbers, ...fetchedNumbers];
    windowNumbers = windowNumbers.slice(-WINDOW_SIZE);

    // Calculate average
    const average = calculateAverage(windowNumbers);

    // Construct response
    const response = {
        numbers: fetchedNumbers,
        windowPrevState: windowNumbers.slice(0, -fetchedNumbers.length),
        windowCurrState: windowNumbers,
        avg: average.toFixed(2)
    };

    res.json(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Average Calculator microservice is running on port ${PORT}`);
});
