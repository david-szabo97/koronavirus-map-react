/* global google */
import React, {Fragment, useCallback, useState, useRef, useEffect} from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Circle } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';
import './Map.css'

const shouldShowLabel = zoomLevel => zoomLevel > 4
const labelStyle = {
  backgroundColor: 'black',
  color: 'white',
  textAlign: 'center',
  fontSize: '11px',
  padding: '2px',
  opacity: '0.5',
  transform: 'translateX(-50%) translateY(16px)'
}
const isPointVisible = (bounds, { latitude, longitude }) => bounds.contains(new google.maps.LatLng(latitude, longitude))

const Map = ({ zoom, center, onMapRef, places, onCenterChanged }) => {
  const mapRef = useRef(null)
  const [zoomLevel, setZoomLevel] = useState(zoom)
  const [bounds, setBounds] = useState(null)

  const handleZoomChanged = useCallback(() => {
    setZoomLevel(mapRef.current.getZoom())
    setBounds(mapRef.current.getBounds())
  }, [mapRef])

  const handleOnDragEnd = useCallback(() => {
    setBounds(mapRef.current.getBounds())
  }, [mapRef])

  useEffect(() => {
    setZoomLevel(mapRef.current.getZoom())
    setBounds(mapRef.current.getBounds())
  }, [zoom, center])

  if (mapRef.current && bounds === null) {
    setBounds(mapRef.current.getBounds())
  }

  useEffect(() => {
    onMapRef(mapRef.current)
  }, [ onMapRef, mapRef ])

  const placesComps = places.map(({ id, latitude, longitude, html, circle }) => {
    return (
      <Fragment key={id}>
        {shouldShowLabel(zoomLevel) && isPointVisible(bounds, { latitude, longitude })  ? <MarkerWithLabel
          position={{
            lat: latitude,
            lng: longitude
          }}
          labelAnchor={new google.maps.Point(0, 0)}
          labelStyle={labelStyle}
        >
          <div dangerouslySetInnerHTML={{__html: html}}/>
        </MarkerWithLabel>
        : ''}

        {circle && <Circle
          defaultCenter={{
            lat: latitude,
            lng: longitude
          }}
          radius={circle.radius * zoomLevel * 1128.497220}
          options={circle.options}
        />}
      </Fragment>
    );
  })

  return (
    <GoogleMap
      onZoomChanged={handleZoomChanged}
      onDragEnd={handleOnDragEnd}
      ref={mapRef}
      onCenterChanged={onCenterChanged}
      zoom={zoom}
      center={center}
    >
      {placesComps}
    </GoogleMap>
  );
}

export default withScriptjs(withGoogleMap(Map));
