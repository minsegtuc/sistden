import { useEffect, useMemo, useState } from 'react'
import { Polygon, Tooltip as Tooltip2, useMap } from 'react-leaflet'

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
        const showTooltip = currentZoom >= minZoomToShow
        return barrios.map((b) => (
            <Polygon key={b.id} pathOptions={{ color }} positions={b.coordenadas}>
                {showTooltip && (
                    <Tooltip2 direction='center' offset={[0, 0]} permanent className='border-none shadow-none bg-white/80 text-wrap min-w-[150px] max-w-[150px]'>
                        <p className='font-bold'>{b.nombre}</p>
                    </Tooltip2>
                )}
            </Polygon>
        ))
    }, [barriosOn, barrios, color, currentZoom, minZoomToShow])

    return polygons
}

export default BarriosLayer


