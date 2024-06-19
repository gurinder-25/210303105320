const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000; // You can set the desired port

// Function to fetch top products from the test server
async function fetchTopProducts(companyName, categoryName, n, minPrice, maxPrice) {
    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products/top-${n}minPrice-${minPrice}&maxPrice-${maxPrice}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching top products from the test server: ${error.message}`);
        return null;
    }
}

// GET endpoint to retrieve top products within a category
app.get('/categories/:categoryName/products', async (req, res) => {
    const { companyName } = req.query;
    const { categoryName } = req.params;
    const { n, minPrice, maxPrice, page = 1 } = req.query;

    // Fetch top products from the test server
    const topProducts = await fetchTopProducts(companyName, categoryName, n, minPrice, maxPrice);
    if (!topProducts) {
        return res.status(500).json({ error: 'Failed to fetch top products' });
    }

    // Implement pagination
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = topProducts.slice(startIndex, endIndex);

    res.json(paginatedProducts);
});

// GET endpoint to retrieve details of a specific product
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    const { companyName } = req.query;
    const { categoryName, productId } = req.params;

    // Fetch top products from the test server
    const topProducts = await fetchTopProducts(companyName, categoryName);

    // Find the product with the specified productId
    const product = topProducts.find(product => product.productId === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Top Products Microservice is running on port ${PORT}`);
});
