export function notFoundHandler(req, res, next) {
  res.status(404).json({ success: false, message: 'Not Found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || undefined;
  res.status(status).json({ success: false, message, errors });
}


