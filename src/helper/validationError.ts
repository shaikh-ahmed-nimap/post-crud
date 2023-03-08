export const createValidationErr = (message: string, path: string) => {
    return {
        "message": message,
        "path": [
            path
        ],
        "type": "any." + path,
        "context": {
            "label": path,
            "key": path
        }
    }
};
