import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const getColorFromPrecision = (tipo) => {
    switch (tipo) {
        case 'ROOFTOP':
            return 'blue';
        case 'RANGE_INTERPOLED':
            return 'green';
        case 'GEOMETRIC_CENTER':
            return 'gold';
        case 'APPROXIMATE':
            return 'red';
        default:
            return 'gray';
    }
};

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: '/leaflet/dist/images/marker-icon.png',
    shadowUrl: '/leaflet/dist/images/marker-shadow.png',
});

export const getIconByPrecision = (tipo_precision) => {
    const color = getColorFromPrecision(tipo_precision);

    return new L.Icon({
        iconUrl: `/sgd/markers/marker-icon-${color}.png`,
        shadowUrl: '/sgd/markers/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};
