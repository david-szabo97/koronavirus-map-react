import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchData } from './api'
import MyMap from './MyMap';

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(data => {
      setData(data)
    })
  }, [])

  const confirmedMax = data ? Math.max(...Object.values(data).map(ele => ele.confirmed)) : 1
  const calcRadius = (ele) => {
    const min = 30
    const max = 300
    const radius = (ele.confirmed / confirmedMax) * max

    return radius < min ? min : radius
  }
  const places = data ? Object.values(data).map(ele => ({
    id: ele.id,
    name: ele.id,
    latitude: parseInt(ele.latitude),
    longitude: parseInt(ele.longitude),
    circle: {
      radius: calcRadius(ele),
      options: {
        strokeColor: "#ff0000"
      }
    },
    html: `${(ele.country + ' ' + ele.province).trim()}<br>Confirmed: ${ele.confirmed}<br>Deaths: ${ele.deaths}<br>Recovered: ${ele.recovered}`
  })) : []

  return (
    <div className="App">
      <MyMap
        center={{ lat: 40.64, lng: -73.96 }}
        zoom={1}
        places={places}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAFaIQUDuULBQUQN1tTOPcsOj_vrHjlgts"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

export default App;
