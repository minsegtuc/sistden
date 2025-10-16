import { useEffect, useMemo, useState } from 'react'
import { Polygon, useMap, Marker } from 'react-leaflet'
import L from 'leaflet'

const BarriosLayer = ({ barriosOn, barrios, color = '#588c6e', minZoomToShow = 16 }) => {
    const map = useMap()
    const [currentZoom, setCurrentZoom] = useState(() => map.getZoom())

    useEffect(() => {
        let timeoutId = null

        const handleZoomEnd = () => {
            // Small debounce to avoid rapid consecutive updates
            if (timeoutId) clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                setCurrentZoom(map.getZoom())
            }, 50)
        }

        setCurrentZoom(map.getZoom())
        map.on('zoomend', handleZoomEnd)
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
            map.off('zoomend', handleZoomEnd)
        }
    }, [map])

    const polygons = useMemo(() => {
        if (!barriosOn || !barrios || barrios.length === 0) return null
        return barrios.map((b) => (
            <Polygon key={b.id} pathOptions={{ color }} positions={b.coordenadas} />
        ))
    }, [barriosOn, barrios, color, currentZoom, minZoomToShow])

    const labels = useMemo(() => {
        if (!barriosOn || !barrios || barrios.length === 0) return null
        if (currentZoom < minZoomToShow) return null

        const createLabelIcon = (text) => L.divIcon({
            className: 'barrios-label',
            html: `<div style="background: rgba(17,24,39,0.72); color: white; padding: 2px 6px; border-radius: 8px; font-weight: 700; font-size: 11px; line-height: 1.1; white-space: nowrap;">${text}</div>`
        })

        const getCentroid = (coords) => {
            if (!Array.isArray(coords) || coords.length === 0) return null
            // coords could be [ [lat,lng], ... ] or nested for multipolygon; handle simple case
            const points = Array.isArray(coords[0][0]) ? coords[0] : coords
            let sumLat = 0, sumLng = 0
            for (let i = 0; i < points.length; i++) {
                sumLat += points[i][0]
                sumLng += points[i][1]
            }
            const n = points.length
            return [sumLat / n, sumLng / n]
        }

        return barrios.map((b) => {
            const center = getCentroid(b.coordenadas)
            if (!center) return null
            return (
                <Marker key={`label-${b.id}`} position={center} icon={createLabelIcon(b.nombre)} interactive={false} />
            )
        })
    }, [barriosOn, barrios, currentZoom, minZoomToShow])

    return <>
        {polygons}
        {labels}
    </>
}

export default BarriosLayer


