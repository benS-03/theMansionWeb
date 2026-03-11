
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class ValidationError extends AppError {
    constructor(message = 'Invalid Input') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError{
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ForbiddenError extends AppError{
    constructor(message = 'Forbidden'){
        super(message, 403)
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

class ConflictError extends AppError{
    constructor(message = 'Resource allready exists') {
        super(message, 409)
    }
}

class UnprocessableError extends AppError {
    constructor(message = 'External service unavailable') {
        super(message, 503);
    }
}

class ExternalServiceError extends AppError {
    constructor(message = 'External Service Unavailable') {
        super(message, 503);
    }
}

module.exports = {
    AppError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnprocessableError,
    ExternalServiceError
}