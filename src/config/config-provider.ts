const env = import.meta.env;

const configProvider = {
    wsServerUrl: env.VITE_WS_SERVER_URL || 'http://localhost:3000',
};

export default configProvider;