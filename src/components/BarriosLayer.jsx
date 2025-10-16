import { useEffect, useMemo, useState } from 'react'
import { Polygon, useMap, Marker } from 'react-leaflet'
import L from 'leaflet'

const BarriosLayer = ({ barriosOn, barrios, color = '#588c6e', minZoomToShow = 15, selectedBarrioId = null }) => {
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
        return barrios.map((b) => {
            const isSelected = selectedBarrioId != null && b.id === selectedBarrioId
            const pathOptions = isSelected ? { color: '#ff3333', weight: 4 } : { color }
            return (
                <Polygon key={b.id} pathOptions={pathOptions} positions={b.coordenadas} />
            )
        })
    }, [barriosOn, barrios, color, currentZoom, minZoomToShow, selectedBarrioId])

    const labels = useMemo(() => {
        if (!barriosOn || !barrios || barrios.length === 0) return null
        if (currentZoom < minZoomToShow) return null

        const createLabelIcon = (text) => L.divIcon({
            className: 'barrios-label',
            html: `<div style="color: #000000; font-weight: 700; font-size: 12px; line-height: 1.1; white-space: nowrap; transform: translate(-50%, -50%);">${text}</div>`
        })

        const polygonCentroid = (ring) => {
            // ring: array of [lat, lng]
            let area = 0
            let cLat = 0
            let cLng = 0
            const n = ring.length
            for (let i = 0; i < n; i++) {
                const [lat1, lng1] = ring[i]
                const [lat2, lng2] = ring[(i + 1) % n]
                const cross = (lng1 * lat2) - (lng2 * lat1)
                area += cross
                cLat += (lat1 + lat2) * cross
                cLng += (lng1 + lng2) * cross
            }
            area *= 0.5
            if (area === 0) {
                let sLat = 0, sLng = 0
                for (let i = 0; i < n; i++) { sLat += ring[i][0]; sLng += ring[i][1]; }
                return [sLat / n, sLng / n]
            }
            return [cLat / (6 * area), cLng / (6 * area)]
        }

        const getCentroid = (coords) => {
            if (!Array.isArray(coords) || coords.length === 0) return null
            // Detect MultiPolygon-like structure
            if (Array.isArray(coords[0][0])) {
                // Choose the largest ring by absolute area
                let best = null
                let bestArea = -Infinity
                for (const ring of coords) {
                    let area = 0
                    const n = ring.length
                    for (let i = 0; i < n; i++) {
                        const [lat1, lng1] = ring[i]
                        const [lat2, lng2] = ring[(i + 1) % n]
                        area += (lng1 * lat2) - (lng2 * lat1)
                    }
                    area = Math.abs(area * 0.5)
                    if (area > bestArea) { bestArea = area; best = ring }
                }
                return best ? polygonCentroid(best) : null
            }
            // Simple polygon ring
            return polygonCentroid(coords)
        }

        return barrios.map((b) => {
            const center = getCentroid(b.coordenadas)
            if (!center) return null
            return (
                <Marker key={`label-${b.id}`} position={center} icon={createLabelIcon(b.nombre)} interactive={false} />
            )
        })
    }, [barriosOn, barrios, currentZoom, minZoomToShow])

    useEffect(() => {
        if (!selectedBarrioId || !Array.isArray(barrios) || barrios.length === 0) return
        const barrio = barrios.find(b => b.id === selectedBarrioId)
        if (!barrio) return

        // Fit bounds to selected barrio
        try {
            const latlngs = barrio.coordenadas
            if (Array.isArray(latlngs) && latlngs.length > 0) {
                // If multipolygon-like (array of rings), flatten
                const rings = Array.isArray(latlngs[0][0]) ? latlngs : [latlngs]
                const all = []
                rings.forEach(r => r.forEach(([lat, lng]) => all.push([lat, lng])))
                if (all.length > 0) {
                    const bounds = L.latLngBounds(all)
                    map.fitBounds(bounds, { padding: [32, 32] })
                }
            }
        } catch (err) {
            // ignore
        }
    }, [selectedBarrioId, barrios, map])

    return <>
        {polygons}
        {labels}
    </>
}

export default BarriosLayer


