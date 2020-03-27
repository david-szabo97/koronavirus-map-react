/* global google */
import React, { Fragment, useCallback, useState, useRef, useEffect } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Circle } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import './Map.css'

const shouldShowLabel = zoomLevel => zoomLevel > 4
const isPointVisible = (bounds, { latitude, longitude }) => bounds.contains(new google.maps.LatLng(latitude, longitude))

const Map = ({ zoom, center, places, onZoomChanged, onCenterChanged }) => {
  const mapRef = useRef(null)
  const [visibles, setVisibles] = useState({})
  const [labelAnchor] = useState(new google.maps.Point(0, 0))

  const handleZoomChanged = useCallback(() => {
    if (!onZoomChanged) return
    onZoomChanged(mapRef.current.getZoom())
  }, [onZoomChanged])

  const handleCenterChanged = useCallback(() => {
    if (!onCenterChanged) return
    onCenterChanged(mapRef.current.getCenter())
  }, [onCenterChanged])

  useEffect(() => {
    const lastBounds = null
    const lastZoomLevel = null

    const interval = setInterval(() => {
      if (!mapRef.current) {
        return
      }

      const bounds = mapRef.current.getBounds()
      const zoomLevel = mapRef.current.getZoom()

      if (lastBounds !== null && lastBounds.equals(bounds)) {
        return
      }

      if (lastZoomLevel !== null && lastZoomLevel === zoomLevel) {
        return
      }

      const visibles = {}
      for (const { id, latitude, longitude } of places) {
        visibles[id] = shouldShowLabel(zoomLevel) && isPointVisible(bounds, { latitude, longitude })
      }

      setVisibles(visibles)
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [places])

  const placesComps = places.map(({ id, center, html, circle, label }) => {
    return (
      <Fragment key={id}>
        {visibles[id]  ? <MarkerWithLabel
          position={center}
          labelAnchor={labelAnchor}
          labelClass="Label"
        >
          {label}
        </MarkerWithLabel>
        : ''}

        {circle && <Circle
          defaultCenter={center}
          radius={circle.radius}
          options={circle.options}
        />}
      </Fragment>
    );
  })

  return (
    <GoogleMap
      onZoomChanged={handleZoomChanged}
      onCenterChanged={handleCenterChanged}
      ref={mapRef}
      zoom={zoom}
      center={center}
    >
      {placesComps}
    </GoogleMap>
  );
}

export default withScriptjs(withGoogleMap(Map));
