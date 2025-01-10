import axios, { AxiosRequestConfig } from 'axios';
import { logger } from './logger';

interface ApiRequestConfig<T> extends AxiosRequestConfig {
    data?: T
}

export async function api<T>(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    headers?: Record<string, string>,
    data?: T,
): Promise<any> {
    const config: ApiRequestConfig<T> = {
        url,
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
        },

    };

    if (data) {
        config.data = data
    }


    try {
        const response = await axios(config);
        logger.info(`API request successful for ${url}: ${response.status}`);
        return response.data;
    } catch (error: any) {
        logger.error(`API request failed for ${url}: ${error.message}`);
        throw error;
    }
}