//const express = require('/data/data/com.termux/files/home/.local/share/pnpm/global/5/node_modules/express/index.js');
const express = require('express')
const path = require('path');
const app = express();
const API_URL = 'https://restcountries.com/v3.1/'
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'dist'));


// Define routes
// Define a route to fetch and display countries
app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}all`);
    const data = await response.json();
    const countries = await sortAlphaBeta(data)
    res.render('index', { countries });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Define an API route to get country data by name
app.get('/country/:name', async (req, res) => {
  try {
    const countryName = req.params.name;
    const response = await fetch(`${API_URL}name/${countryName}`);
    if (response.ok) {
      const countryData = await response.json();
      if (countryData.length > 0) {
        const country = countryData[0]; // Assuming the first entry is the correct one
        res.render('country', { country }); // Pass 'country' to the template
      } else {
        res.status(404).send('Country not found');
      }
    } else {
      res.status(500).send('Error fetching data');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


function sortAlphaBeta(data) {
  return data.sort((a, b) => a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase()));
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
