// chess_pawns.js

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import './styles.css';

// Pawn Component - Resembling a chess soldier pawn
export function Pawn({ steps, setSteps, records, setRecords }) {
  const ref = useRef();
  const squareSize = 0.5; // Chessboard square size
  const boardSize = 8; // 8x8 board

  const moveForward = () => {
    const currentX = ref.current.position.x;
    const currentZ = ref.current.position.z;

    // Leave a record at the current position
    setRecords([...records, { position: [currentX, 0, currentZ] }]);

    // Calculate the next position
    let newX = currentX + squareSize;
    let newZ = currentZ;

    if (newX >= boardSize * squareSize / 2) {
      // Move to the next row if end of row reached
      newX = -boardSize * squareSize / 2;
      newZ -= squareSize;
    }

    // Wrap to start if reaching the end of the chessboard
    if (newZ < -boardSize * squareSize / 2) {
      newX = -boardSize * squareSize / 2;
      newZ = boardSize * squareSize / 2 - squareSize;
    }

    ref.current.position.set(newX, 0, newZ);
    setSteps(steps + 1);
  };

  return (
    <>
      <group ref={ref} position={[-boardSize * squareSize / 2, 0, boardSize * squareSize / 2 - squareSize]}>
        {/* Base of the pawn */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Body of the pawn */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.4, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Head of the pawn */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
      <Html position={[0.5, 1, -2]}>
        <button className="move-button" onClick={moveForward}>
          Move Pawn
        </button>
      </Html>
    </>
  );
}

// Chessboard Component - 8x8 board setup
export function Chessboard({ records = [] }) { // Set default value for records as an empty array
  const squares = [];
  const squareSize = 0.5;

  // Create an 8x8 grid of squares for the chessboard
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const color = (row + col) % 2 === 0 ? '#D2B48C' : '#8B4513'; // Light brown and dark brown
      squares.push(
        <mesh key={`${row}-${col}`} position={[col * squareSize - 2, -0.3, row * squareSize - 2]}>
          <boxGeometry args={[squareSize, 0.1, squareSize]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
  }

  // Ensure records is an array before mapping over it
  const recordPawns = Array.isArray(records)
    ? records.map((record, index) => (
        <group key={index} position={record.position}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.2, 0.1, 32]} />
            <meshStandardMaterial color="#ff0000" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.4, 32]} />
            <meshStandardMaterial color="#ff0000" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#ff0000" />
          </mesh>
        </group>
      ))
    : [];

  return <group>{[...squares, ...recordPawns]}</group>;
}

// Dashboard Component
function Dashboard({ steps }) {
  return (
    <Html position={[2, 1.5, -2]}>
      <div className="dashboard">
        <p>Steps: {steps}</p>
      </div>
    </Html>
  );
}

// Scene Component
export default function Scene() {
  const [steps, setSteps] = useState(0);
  const [records, setRecords] = useState([]); // Initialize as an empty array

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Chessboard records={records} />
      <Pawn steps={steps} setSteps={setSteps} records={records} setRecords={setRecords} />
      <Dashboard steps={steps} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
