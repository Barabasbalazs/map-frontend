const env = import.meta.env;

const configProvider = {
    tileLayerSource: env.VITE_TILE_LAYER_SOURCE || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    coords: {
        lat: env.VITE_COORDS_LAT || 51.505,
        lng: env.VITE_COORDS_LNG || -0.09,
    },
    wsServerUrl: env.VITE_WS_SERVER_URL || 'http://localhost:3000',
};

export default configProvider;