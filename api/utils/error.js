// custom error handling
export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}

/* Notes: errorHandler helper
What it is
A helper function that creates a custom error object carrying an HTTP status code and a message
Lives in a utils file (e.g. utils/error.js) and is reused across the app

Line by line

export const errorHandler = (statusCode, message) => {
export makes it importable in other files
Takes two parameters: the HTTP status code (e.g. 404, 500) and the error message

const error = new Error();
Creates an empty built-in JavaScript Error object
Comes with a message and a stack trace, but no status code

error.statusCode = statusCode;
Adds a custom property to the error
Built-in Error has no statusCode, but JS objects allow extra properties

error.message = message;
Sets the error’s message text

return error;
Returns the error (does not throw it)
The caller decides what to do with it

Why we need it
A plain Error only holds a message
Express needs to know which status code to send back to the client
This helper bundles both together

*/