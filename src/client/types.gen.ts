// This file is auto-generated by @hey-api/openapi-ts

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type GetDomainJunidPostData = {
    codeBlock: string;
};

export type GetDomainJunidPostResponse = string [];

export type $OpenApiTs = {
    '/junid': {
        post: {
            req: GetDomainJunidPostData;
            res: {
                /**
                 * Successful Response
                 */
                200: unknown;
                /**
                 * Validation Error
                 */
                422: HTTPValidationError;
            };
        };
    };
};