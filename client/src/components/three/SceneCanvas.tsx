import React, { Suspense, PropsWithChildren } from 'react';
import { Canvas, type RootState } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';

export type SceneCanvasProps = PropsWithChildren<{
  className?: string;
  enableBloom?: boolean;
  enableVignette?: boolean;
  useSMAA?: boolean;
  exposure?: number;
  dprMax?: number; // mobile-friendly cap
}>;

export default function SceneCanvas({
  className,
  children,
  enableBloom = true,
  enableVignette = true,
  useSMAA = true,
  exposure = 1.0,
  dprMax = 1.5,
}: SceneCanvasProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, dprMax]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={(state: RootState) => {
        const { gl } = state;
        (gl as any).physicallyCorrectLights = true;
        (gl as any).toneMappingExposure = exposure;
        // Let R3F manage color space defaults; keep setup minimal
      }}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <Suspense fallback={null}>
        {children}
        <EffectComposer multisampling={0}>
          {enableBloom && (
            <Bloom
              intensity={0.5}
              mipmapBlur
              luminanceThreshold={0.2}
              luminanceSmoothing={0.1}
            />
          )}
          {useSMAA && <SMAA />}
          {enableVignette && <Vignette eskil={false} offset={0.2} darkness={0.5} />}
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
