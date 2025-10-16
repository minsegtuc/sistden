// You can define this inside your Clasificacion.jsx file or in a separate file.

const MapEvents = ({ setZoom }) => {
    const map = useMap(); // This is now safe because it's inside MapContainer

    useEffect(() => {
        // Set initial zoom
        setZoom(map.getZoom());

        const handleZoom = () => {
            setZoom(map.getZoom());
        };

        map.on('zoomend', handleZoom);

        // Cleanup function to remove the event listener
        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map, setZoom]); // Add dependencies

    // This component doesn't render anything itself
    return null;
};