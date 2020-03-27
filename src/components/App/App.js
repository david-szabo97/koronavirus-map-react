/* global google */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { fetchData } from '../../api'
import Map from '../Map/Map';
import Panel from '../Panel/Panel';
import List from '../List/List';
import Loading from '../Loading/Loading';

const centerCoords = { lat: 0.25, lng: 30.85 }
const defaultZoom = 2
const numberFormat = new Intl.NumberFormat();

const formatName = ({ province, country }) => province === country ? country : (province + ' ' + country).trim()
const formatNumber = number =>numberFormat.format(number)

const calcRadius = (confirmed, confirmedMax) => Math.log(confirmed) * 20000

function App() {
  const [data, setData] = useState(null)
  const [center, setCenter] = useState(centerCoords)
  const [zoom, setZoom] = useState(defaultZoom)

  useEffect(() => {
    fetchData()
      .then(data => {
        const dataRows = Object.values(data)
        const confirmedMax = data ? Math.max(...dataRows.map(ele => ele.confirmed)) : 1

        const places = dataRows.filter(({ latitude, longitude }) => latitude && longitude).map(({ id, country, province, latitude, longitude, confirmed, deaths, recovered}) => ({
          id: id,
          name: id,
          latitude,
          longitude,
          circle: {
            radius: calcRadius(confirmed, confirmedMax),
            options: {
              strokeColor: "#ff0000"
            }
          },
          center: {
            lat: latitude,
            lng: longitude
          },
          label: <div>{formatName({ country, province })}<br />Confirmed: {confirmed}<br />Deaths: {deaths}<br />Recovered: {recovered}</div>
        }))

        const totalConfirmed = dataRows.map(ele => ele.confirmed).reduce((acc, val) => acc + val, 0)
        const totalDeaths = dataRows.map(ele => ele.deaths).reduce((acc, val) => acc + val, 0)
        const totalRecovered = dataRows.map(ele => ele.recovered).reduce((acc, val) => acc + val, 0)

        const casesRows = dataRows.filter(({ confirmed }) => confirmed > 0).sort(({confirmed: a}, {confirmed: b}) => b - a)
        const deathsRows = dataRows.filter(({ deaths }) => deaths > 0).sort(({deaths: a}, {deaths: b}) => b - a)
        const recoveredRows = dataRows.filter(({ recovered }) => recovered > 0).sort(({recovered: a}, {recovered: b}) => b - a)

        setData({
          objs: data,
          places,
          totalConfirmed,
          totalDeaths,
          totalRecovered,
          casesRows,
          deathsRows,
          recoveredRows
        })
      })
  }, [])

  const handleListItemClick = useCallback(id => {
    const obj = data.objs[id]
    setCenter(new google.maps.LatLng(obj.latitude, obj.longitude))
    setZoom(6)
  }, [ data ])

  if (!data) {
    return <Loading />
  }

  const {
    places,
    totalConfirmed,
    totalDeaths,
    totalRecovered,
    casesRows,
    deathsRows,
    recoveredRows
  } = data

  return (
    <div className="App">
      <div className="Column Column-Left">
        <Panel title="Total Confirmed" subtitle={formatNumber(totalConfirmed)} subtitleStyle={{fontSize: '72px'}} containerClass="Panel-TotalConfirmed" />

        <Panel title="Confirmed Cases">
          <List>
            {casesRows.map(({ id, country, province, confirmed }) => (
              <List.Item key={id} id={id} onClick={handleListItemClick} style={{ cursor: 'pointer' }}>
                <span style={{color: '#F44336', fontWeight: 'bold'}}>{formatNumber(confirmed)}</span> {formatName({ province, country })}
              </List.Item>
            ))}
          </List>
        </Panel>
      </div>

      <div className="Column Column-Map">
        <Map
          zoom={zoom}
          places={places}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY || ''}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          center={center}
        />
      </div>

      <div className="Column Column-Right">
        <Panel title="Total Deaths" subtitle={formatNumber(totalDeaths)} subtitleStyle={{color: '#F44336', fontSize: '72px'}}>
          <List>
            {deathsRows.map(({ id, country, province, deaths }) => (
              <List.Item key={id}>{formatNumber(deaths)} deaths<br />{formatName({ province, country })}</List.Item>
            ))}
          </List>
        </Panel>

        <Panel title="Total Recovered" subtitle={formatNumber(totalRecovered)} subtitleStyle={{color: '#4CAF50', fontSize: '72px'}}>
          <List>
            {recoveredRows.map(({ id, country, province, recovered }) => (
              <List.Item key={id}>{formatNumber(recovered)} recovered<br />{formatName({ province, country })}</List.Item>
            ))}
          </List>
        </Panel>
      </div>
    </div>
  );
}

export default App;
