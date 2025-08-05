import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { getRandomCapital } from '../utils/api';
import L from 'leaflet';
import FeedbackModal from './FeedbackModal';
import './FeedbackModal.css';

type CapitalData = {
  country: string;
  capital: string;
  lat: number;
  lng: number;
};

const GameMap = () => {
  const [question, setQuestion] = useState('');
  const [correctCoords, setCorrectCoords] = useState<[number, number] | null>(null);
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [wasCorrect, setWasCorrect] = useState(false);

  const generateQuestion = async () => {
    const data = await getRandomCapital();
    if (data) {
      setQuestion(`Identify the capital city of ${data.country}`);
      setCorrectCoords([data.lat, data.lng]);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const clicked = [e.latlng.lat, e.latlng.lng] as [number, number];
    setClickedCoords(clicked);

    if (correctCoords) {
      const distance = getDistance(clicked[0], clicked[1], correctCoords[0], correctCoords[1]);
      if (distance < 100) {
        setFeedbackText('✅ Correct!');
        setScore((prev) => prev + 10);
        setWasCorrect(true);
      } else {
        setFeedbackText(`❌ Wrong! You were ${Math.round(distance)} km away.`);
        setWasCorrect(false);
      }
      setShowFeedback(true);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    generateQuestion();
  };

  const ClickHandler = () => {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  };

  return (
    <div className="game">
      <div className="question-box">
        <h2>{question}</h2>
        <p>Score: {score}</p>
      </div>

      <MapContainer
        center={[20, 0] as [number, number]}
        zoom={2}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler />
        {clickedCoords && (
          <Marker position={clickedCoords}>
            <Popup>You clicked here!</Popup>
          </Marker>
        )}
      </MapContainer>

      <FeedbackModal
        show={showFeedback}
        onClose={handleCloseFeedback}
        message={feedbackText}
        correct={wasCorrect}
      />
    </div>
  );
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export default GameMap;
