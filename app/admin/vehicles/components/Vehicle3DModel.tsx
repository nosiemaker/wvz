"use client"

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'

type Point3D = {
    id: number
    position: [number, number, number]
    note?: string
}

const Marker = ({ position, onClick, isSelected }: { position: [number, number, number], onClick: (e: any) => void, isSelected: boolean }) => {
    return (
        <mesh position={position} onClick={onClick}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={isSelected ? "#EE401D" : "white"} emissive={isSelected ? "#EE401D" : "#ffaaaa"} emissiveIntensity={0.5} />
            {isSelected && (
                <Html position={[0, 0.4, 0]} center>
                    <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap font-bold pointer-events-none">
                        Selected
                    </div>
                </Html>
            )}
        </mesh>
    )
}

const LowPolyCar = ({ onCarClick }: { onCarClick: (point: [number, number, number]) => void }) => {
    const handleClick = (e: any) => {
        e.stopPropagation()
        // Get the exact point of intersection
        onCarClick([e.point.x, e.point.y, e.point.z])
    }

    return (
        <group dispose={null} onClick={handleClick}>
            {/* Main Body */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 0.6, 4.4]} />
                <meshStandardMaterial color="#eff6ff" roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Cabin Top */}
            <mesh position={[0, 1.25, -0.2]} castShadow receiveShadow>
                <boxGeometry args={[1.7, 0.6, 2.2]} />
                <meshStandardMaterial color="#dbeafe" roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Windshield Front */}
            <mesh position={[0, 1.25, 1.01]} rotation={[-0.2, 0, 0]} castShadow>
                <boxGeometry args={[1.5, 0.5, 0.1]} />
                <meshStandardMaterial color="#93c5fd" transparent opacity={0.6} roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Windshield Rear */}
            <mesh position={[0, 1.25, -1.41]} rotation={[0.2, 0, 0]} castShadow>
                <boxGeometry args={[1.5, 0.5, 0.1]} />
                <meshStandardMaterial color="#93c5fd" transparent opacity={0.6} roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Wheels */}
            <group position={[0, 0.35, 0]}>
                <mesh position={[1, 0, 1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[-1, 0, 1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[1, 0, -1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[-1, 0, -1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
            </group>

            {/* Headlights */}
            <mesh position={[0.6, 0.6, 2.2]} castShadow>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#fae8ff" emissive="white" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.6, 0.6, 2.2]} castShadow>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#fae8ff" emissive="white" emissiveIntensity={2} />
            </mesh>

            {/* Taillights */}
            <mesh position={[0.6, 0.6, -2.2]} castShadow>
                <boxGeometry args={[0.3, 0.15, 0.1]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
            <mesh position={[-0.6, 0.6, -2.2]} castShadow>
                <boxGeometry args={[0.3, 0.15, 0.1]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
            </mesh>
        </group>
    )
}

interface Vehicle3DModelProps {
    points: Point3D[]
    onAddPoint: (position: [number, number, number]) => void
    onSelectPoint: (id: number) => void
    selectedPointId: number | null
}

export default function Vehicle3DModel({ points, onAddPoint, onSelectPoint, selectedPointId }: Vehicle3DModelProps) {
    return (
        <div className="w-full h-full min-h-[400px] bg-slate-50 rounded-lg overflow-hidden relative cursor-crosshair">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={50} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
                <group position={[0, -0.5, 0]}>
                    <LowPolyCar onCarClick={onAddPoint} />
                    {points.map(p => (
                        <Marker
                            key={p.id}
                            position={p.position}
                            isSelected={p.id === selectedPointId}
                            onClick={(e) => {
                                e.stopPropagation()
                                onSelectPoint(p.id)
                            }}
                        />
                    ))}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <shadowMaterial opacity={0.2} />
                    </mesh>
                    <gridHelper args={[20, 20, 0xff0000, 0xcccccc]} position={[0, 0.01, 0]} />
                </group>
                <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
                <Environment preset="city" />
            </Canvas>
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="bg-black/50 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                    Drag to Rotate • Pinch to Zoom • Tap to Mark
                </span>
            </div>
        </div>
    )
}
