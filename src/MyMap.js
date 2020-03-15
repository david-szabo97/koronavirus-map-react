/* global google */
import React, {Fragment, useCallback, useState, useRef} from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Circle } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';

const shouldShowLabel = zoomLevel => zoomLevel > 4

const Map = props => {
  const mapRef = useRef(null)
  const [zoomLevel, setZoomLevel] = useState(props.zoom)

  const handleZoomChanged = useCallback((...args) => {
    setZoomLevel(mapRef.current.getZoom())
  }, [mapRef])

  console.log(zoomLevel)
  const places = props.places.map(place => {
    return (
      <Fragment key={place.id}>
        {shouldShowLabel(zoomLevel) ? <MarkerWithLabel
          position={{
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude)
          }}
          labelAnchor={new google.maps.Point(0, 0)}
          labelStyle={{
            backgroundColor: 'black',
            color: 'white',
            textAlign: 'center',
            fontSize: '11px',
            padding: '2px',
            opacity: '0.5',
            transform: 'translateX(-50%) translateY(16px)'
          }}
        >
          <div dangerouslySetInnerHTML={{__html: place.html}}/>
        </MarkerWithLabel>
        : ''}
        {place.circle && <Circle
          defaultCenter={{
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude)
          }}
          radius={place.circle.radius * zoomLevel * 1128.497220}
          options={place.circle.options}
        />}
      </Fragment>
    );
  })

  return (
    <GoogleMap
      defaultZoom={props.zoom}
      defaultCenter={props.center}
      onZoomChanged={handleZoomChanged}
      ref={mapRef}
    >
      {places}
    </GoogleMap>
  );
}

export default withScriptjs(withGoogleMap(Map));
