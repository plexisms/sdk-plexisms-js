export class PlexismsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PlexismsError';
    }
}

export class AuthenticationError extends PlexismsError {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class BalanceError extends PlexismsError {
    constructor(message: string) {
        super(message);
        this.name = 'BalanceError';
    }
}

export class APIError extends PlexismsError {
    statusCode?: number;
    responseBody?: Record<string, unknown>;

    constructor(message: string, statusCode?: number, responseBody?: Record<string, unknown>) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}
