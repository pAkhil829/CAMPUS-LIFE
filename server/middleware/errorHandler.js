const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({ field: e.path, message: e.message }));
        return res.status(400).json({ error: 'Validation error', details: errors });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Resource already exists.' });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: 'Invalid reference. Related resource not found.' });
    }

    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
