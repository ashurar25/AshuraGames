import React, { useRef } from 'react';
import { Group, Vector3 } from 'three';
import { Float, Environment, MeshTransmissionMaterial, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import SceneCanvas from './SceneCanvas';

/**
 * Fullscreen 3D background with subtle mint neon + glass vibe.
 * Mobile-first: capped DPR, light bloom, simple geometry.
 */
export default function HomeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <SceneCanvas enableBloom enableVignette useSMAA={true} exposure={1.0} dprMax={1.5}>
        {/* Soft environment for PBR */}
        <Environment preset="city" background={false} />

        {/* Floating glassy objects */}
        <Float rotationIntensity={0.2} floatIntensity={0.6} speed={1.2}>
          <MintGlassCluster />
        </Float>

        {/* Mint accent glow planes (very subtle) */}
        <MintAccentPlanes />
      </SceneCanvas>
    </div>
  );
}

function MintGlassCluster() {
  const group = useRef<Group>(null);
  const t = useRef(0);

  useFrame((_, delta: number) => {
    t.current += delta;
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
      group.current.rotation.x = Math.sin(t.current * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Center glass orb */}
      <mesh position={[0, 0, 0]}> 
        <icosahedronGeometry args={[1.1, 2]} />
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.6}
          roughness={0.12}
          ior={1.3}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.05}
          distortionScale={0.2}
          temporalDistortion={0.1}
          attenuationColor="#70f7d1" // mint
          attenuationDistance={1.2}
          color="#a7ffe8"
          transparent
        />
      </mesh>

      {/* Side shards */}
      <Shard pos={[-2.2, 0.6, -0.6]} scale={0.9} />
      <Shard pos={[2.1, -0.4, 0.4]} scale={0.8} />
      <Shard pos={[0.2, 1.8, -0.8]} scale={0.7} />
    </group>
  );
}

function Shard({ pos, scale }: { pos: [number, number, number]; scale: number }) {
  const v = new Vector3(...pos);
  return (
    <mesh position={v} scale={scale}>
      <octahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#0f172a"
        metalness={0.8}
        roughness={0.2}
        emissive="#67e8f9"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function MintAccentPlanes() {
  return (
    <group>
      <mesh position={[0, -2.2, -2]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#70f7d1" transparent opacity={0.05} />
      </mesh>
      <mesh position={[-3, 2, -3]} rotation={[0.3, 0.2, -0.4]}>
        <planeGeometry args={[8, 4]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
