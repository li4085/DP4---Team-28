import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"; //imports map comps
import 'leaflet/dist/leaflet.css'; //imports built-in styles
import L from 'leaflet'; //imports library
import 'leaflet-routing-machine';
 
delete L.Icon.Default.prototype._getIconUrl; //this breaks when its used with vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
//tells leaflet where to find the marker icons since the default paths are broken in vite
 
const clients = [
  { id: 1, name: "Client A", address: "123 Main St, Hamilton, Ontario" },
  { id: 2, name: "Client B", address: "456 King St, Hamilton, Ontario" },
]; //will eventually be replaced with data from the backend, but for now this is just some dummy data to show how the map works
 
function RoutingControl({ from, to }) {
  const map = useMap();
  useEffect(function() {
    if (!from || !to) return; //if either location is missing, dont do anything
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)    ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);
    return function() {
      map.removeControl(routingControl);
    } //cleanup function to remove the routing control when the component unmounts or when from/to changes
  }, [from, to]);
  return null;
}
 
export default function PSWMap() {
  const location = useLocation();
  const [markers, setMarkers] = useState([]); //iniitalizes empty array
  const [pswLocation, setPswLocation] = useState(null); //starts when you dont know psw location
  const [patient, setPatient] = useState(null);
 
  //async waits for function to continue until it gets a response from the api, which is necessary since we need the coordinates to build the markers
  async function getCoordinates(address) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    ); //sends a request to the free geocoding api and converts characters to format and limit 1 means it returns the best match
    const data = await response.json();  //converts to javascript response
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon) //returns coordinate
      };
    }
    return null; //returns noting if no results
  }
 
  navigator.geolocation.watchPosition(
  function(position) {
    setPswLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }
);
 
let pswMarker = null;
if (pswLocation) {
  pswMarker = (
    <Marker position={[pswLocation.lat, pswLocation.lng]}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
 
useEffect(function() { //runs once page loads
    async function buildMarkers() {
      const built = [];
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        const coords = await getCoordinates(client.address);
        if (coords) {
          built.push(
            <Marker key={client.id} position={[coords.lat, coords.lng]}>
              <Popup>
                <strong>{client.name}</strong>
                <br />
                {client.address}
                <br />
                <button onClick={function() {
                  setPatient({ lat: coords.lat, lng: coords.lng });
                }}>
                  Get Directions
                </button>
              </Popup>
            </Marker>
          );
        }
      }
      setMarkers(built);
    }
    buildMarkers();
  }, []);
 
  return (
    <div style={{ display: 'flex', width: '100%' }}>
    <style>{`
      .leaflet-routing-container {
        background-color: #7ed957;
        color: white;
        font-family: Monospace;
        border-radius: 12px;
        padding: 10px;
      }
      .leaflet-routing-alt {
        background-color: #7ed957;
      }
    `}</style>
 
      {/* Side Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#7ed957',
          height: '650px',
          width: '200px'
        }}>
 
          <Link to="/psw" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box'
          }}>Home</Link>
 
          <Link to="/psw/schedule" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box'
          }}>Schedule</Link>
 
          <Link to="/psw/history" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box'
          }}>History</Link>
 
          <Link to="/psw/map" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            borderBottom: '5px solid #64a449',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: location.pathname === '/psw/map' ? '#64a449' : 'transparent'
          }}>Map</Link>
 
          <Link to="/psw/settings" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '36px',
            padding: '50px 20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>Settings</Link>
 
        </nav>
      </div>
 
      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '20px'
      }}>
        <h1 style={{
          color: '#7ed957',
          fontSize: '60px',
          marginBottom: '20px',
          fontFamily: 'Monospace',
        }}>Map</h1>
 
        <MapContainer
          center={[43.2557, -79.8711]} //hamilton starting coords
          zoom={13} //zoom level
          style={{
            height: '600px', //so that map shows
            width: '100%',
            borderRadius: '12px'
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" //standard for react leaflet library
            attribution='© OpenStreetMap contributors'
          />
          {markers}
          {pswMarker}
          {pswLocation && patient && (
          <RoutingControl from={pswLocation} to={patient} />
)}
        </MapContainer>
 
      </div>
    </div>
  );
}
 