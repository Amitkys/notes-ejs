/*
// const date = new Date('2024-09-24T09:33:40.964Z');
// console.log(date.toLocaleTimeString('en-US', {
//                hour: 'numeric',    
//                minute: 'numeric',  
//                second: 'numeric',  
//                hour12: true,       
//                timeZone: 'Asia/Kolkata'  // Set timezone to IST
// }));


// Import Joi
const Joi = require('joi');

// Define a schema for user registration
const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(), // Must be a string between 3 and 30 characters
    password: Joi.string().min(8).required(), // Must be a string with a minimum length of 8
    email: Joi.string().email().required(), // Must be a valid email address
});

// Example user data to validate
const userData = {
    username: 'Je',
    password: 'password123',
    email: 'john.doe@example.com',
};

// Validate the user data
const { error, value } = schema.validate({
    username: 'Jesfdsfsdf',
    password: 'password123',
    email: 'john.doe@example.com',
});

if (error) {
    console.error('Validation failed:', error.details);
} else {
    console.log('Validation successful:', value);
}
    */
/* testing rate limit

const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Define global rate limit
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests, please wait and try again.',
});

// Exclude a specific route before applying the global limiter
app.get('/excluded-route', (req, res) => {
  res.send('This route is not rate-limited');
});

// Apply rate limiter to all other routes
app.use(limiter);

// Example of other routes
app.get('/', (req, res) => {
  res.send('Home Page with rate limiting');
});

app.get('/api', (req, res) => {
  res.send('API route with rate limiting');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

*/