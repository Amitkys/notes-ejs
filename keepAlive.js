const axios = require('axios');
const url = `https://notes-ejs.onrender.com/`; // Replace with your Render URL
const interval = 30000; // 30 seconds

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status ${response.status}`);
    })
    .catch(error => {
      console.error(`Error at ${new Date().toISOString()}:`, error.message);

    });
}

setInterval(reloadWebsite, interval);
