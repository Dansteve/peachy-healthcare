
import { ResponseData } from '@peachy-healthcare/app-interface';

export const sensitiveDataKey = [
    'password', 'password_confirmation'
];

export const sensitiveData = [
    ...sensitiveDataKey,
    ...sensitiveDataKey.map((key) => key.toLowerCase()),
    ...sensitiveDataKey.map((key) => key.toUpperCase())
];

export const responseData = <T>(data: T, message: string, status: number): ResponseData<T> => {
    return {
        data: data && removeSensitiveData<T>(data),
        message,
        status
    };
};

export const removeSensitiveData = <T>(properties: any): T => {
    if (typeof properties === 'object' && properties !== null && !Array.isArray(properties)) {
        const cleanObject = { ...properties };
        for (const key in cleanObject) {
            if (sensitiveData.includes(key.toLowerCase())) {
                delete cleanObject[key];
            }
        }

        return cleanObject;
    }

    if (typeof properties === 'object' && Array.isArray(properties)) {
        const cleanArray = properties.map((property) => removeSensitiveData(property));

        return cleanArray as unknown as T;
    }

    return properties;
};
