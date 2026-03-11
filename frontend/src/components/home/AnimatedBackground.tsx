import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

export const AnimatedBlob = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <Icosahedron ref={meshRef} args={[1, 64]} scale={2.5}>
            <MeshDistortMaterial
                color="#1a1a1a"
                emissive="#0a0a0a"
                envMapIntensity={0.5}
                clearcoat={0.9}
                clearcoatRoughness={0.1}
                metalness={0.8}
                roughness={0.2}
                distort={0.4}
                speed={1.5}
            />
        </Icosahedron>
    );
};

export const AnimatedBackground = () => {
    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
            <directionalLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
            <AnimatedBlob />
            <Environment preset="city" />
        </>
    );
};
