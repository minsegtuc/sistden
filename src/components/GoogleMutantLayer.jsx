// GoogleMutantLayer.jsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

const GoogleMutantLayer = ({ type = 'roadmap' }) => {
    const map = useMap(); 

    useEffect(() => {
        const googleLayer = L.gridLayer.googleMutant({
            type,
        });

        map.addLayer(googleLayer);

        return () => {
            map.removeLayer(googleLayer);
        };
    }, [map, type]);

    return null;
};

export default GoogleMutantLayer;

