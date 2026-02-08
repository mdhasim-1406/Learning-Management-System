import { useState, useEffect, useRef } from 'react';
import HALO from 'vanta/dist/vanta.halo.min';
import * as THREE from 'three';

const AnimatedBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          baseColor: 0x065f46,
          backgroundColor: 0x022c22,
          amplitudeFactor: 1.5,
          xOffset: 0.1,
          yOffset: 0.1,
          size: 1.5
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="fixed inset-0 w-full h-full -z-10">
      {children}
    </div>
  );
};

export default AnimatedBackground;
