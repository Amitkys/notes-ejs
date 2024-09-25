const Joi = require('joi');

// Define the schema
const schema = Joi.object({
    title: Joi.string().min(5).max(10).required().messages({
        'string.empty': 'Title is required.',
        'any.required': 'Title is required.',
        'string.min': 'Title is too short',
        'string.max': 'Title length should be 10 or less'
    }),
    note: Joi.string().min(1).required().messages({
        'string.empty': 'Note is required.',
        'any.required': 'Note is required.'
    }),
});

// Middleware function
const validateRequestBody = (req, res, next) => {
    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body);

    // Log the request body in a readable format
    // console.log('Request Body:', JSON.stringify(value, null, 2));

    // If validation fails, store the error message in flash and redirect back
    if (error) {
        req.flash('warning', error.details[0].message); // Store error message in flash

        // Get the referrer or fallback to a default route
        const redirectUrl = req.get('Referer') || '/';

        // Redirect to the referrer or the fallback URL
        return res.redirect(redirectUrl);
        
    }

    // If validation succeeds, continue to the next middleware
    next();
};

module.exports = validateRequestBody;
