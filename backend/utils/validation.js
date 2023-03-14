const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        console.log('********************HANDLE VALIDATION*************************', 'validationErrors:', validationErrors)
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.param] = error.msg);

        const err = new Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        console.log('BEFORE NEXT', err)
        // throw new Error('Sanity check');
        next(err);
    } else {
        next();
    }
};

module.exports = {
    handleValidationErrors
};
