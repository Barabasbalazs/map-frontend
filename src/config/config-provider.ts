const env = import.meta.env;

const configProvider = {
    wsServerUrl: env.VITE_WS_SERVER_URL || 'http://localhost:3000',
    apiUrl: `${env.VITE_API_URL}/${env.VITE_API_VERSION}` || 'http://localhost:8080/v1',
};

export default configProvider;