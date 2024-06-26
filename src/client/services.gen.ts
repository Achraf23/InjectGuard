// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { GetDomainJunidPostData, GetDomainJunidPostResponse } from './types.gen';

/**
 * Get Domain
 * @param data The data for the request.
 * @param data.codeBlock
 * @returns unknown Successful Response
 * @throws ApiError
 */
export const getDomainJunidPost = (data: GetDomainJunidPostData): CancelablePromise<GetDomainJunidPostResponse> => { return __request(OpenAPI, {
    method: 'POST',
    url: '/junid',
    query: {
        codeBlock: data.codeBlock
    },
    errors: {
        422: 'Validation Error'
    }
}); };