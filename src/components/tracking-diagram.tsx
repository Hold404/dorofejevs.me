import { MotionFigure } from "@/components/motion-figure";
import {
  ballPosition,
  cameras,
  rayTransform,
  trackingKeyframes,
} from "@/lib/tracking-motion";

export function TrackingDiagram() {
  const midpoint = ballPosition(0.5);
  return (
    <MotionFigure className="tracking-figure">
      <div className="diagram-label">Three cameras → one trajectory</div>
      <style>{trackingKeyframes}</style>
      <svg
        viewBox="0 0 560 330"
        role="img"
        aria-labelledby="tracking-title tracking-description"
      >
        <title id="tracking-title">
          Multi-camera volleyball tracking concept
        </title>
        <desc id="tracking-description">
          A volleyball follows an arc over a court. Three camera sight lines
          follow its position, while a marker shows its projection onto the
          ground. This is a conceptual illustration, not recorded tracking data.
        </desc>
        <g fill="none" stroke="#505b66" strokeWidth="1.2">
          <path d="M105 210 315 140 455 215 245 285Z" fill="#191e22" />
          <path d="M210 175 350 250M175 187 315 262M245 163 385 238" />
          <path d="M210 179v-74M350 254v-74" stroke="#a6b0b9" strokeWidth="2" />
          <path
            d="m210 110 140 75v65l-140-75Z"
            fill="#15181b"
            fillOpacity=".45"
          />
          <path
            d="m210 123 140 75m-140-62 140 75m-140-62 140 75m-140-62 140 75M230 121v65m20-54v65m20-54v65m20-54v65m20-54v65m20-54v65"
            strokeWidth=".7"
            opacity=".65"
          />
        </g>
        <path
          d="M170 230Q280 -30 390 190"
          fill="none"
          stroke="#e5ae76"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          opacity=".55"
        />
        <g className="tracking-motion tracking-fade">
          {cameras.map((camera, index) => (
            <g key={index} transform={`translate(${camera.x} ${camera.y})`}>
              <path
                d="M0 0H1"
                className="tracking-motion tracking-ray"
                style={{
                  transform: rayTransform(camera, 0.5),
                  animationName: `tracking-ray-${index}`,
                }}
                fill="none"
                stroke="#8bafc2"
                strokeWidth="1"
                opacity=".55"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          <g
            className="tracking-motion tracking-shadow"
            style={{
              transform: `translate(${midpoint.x}px,${midpoint.groundY}px)`,
            }}
          >
            <ellipse
              rx="8"
              ry="3.5"
              fill="#e5ae76"
              fillOpacity=".25"
              stroke="#e5ae76"
              strokeWidth="1"
            />
            <path d="M-12 0h24M0-6V6" stroke="#e5ae76" strokeWidth=".7" />
          </g>
          <g
            className="tracking-motion tracking-ball"
            style={{ transform: `translate(${midpoint.x}px,${midpoint.y}px)` }}
          >
            <circle r="7" fill="#f0e7da" stroke="#e5ae76" strokeWidth="1.2" />
            <path
              d="M-6-3Q0 0 6-3M0-7Q-2-1 4 5M-6 3Q-1 0 4 5"
              fill="none"
              stroke="#615547"
              strokeWidth="1"
            />
          </g>
        </g>
        {cameras.map((camera, index) => (
          <g key={index} transform={`translate(${camera.x} ${camera.y})`}>
            <g fill="#15181b" stroke="#a5bfcd" strokeWidth="1.3">
              <rect x="-14" y="-10" width="26" height="20" rx="3" />
              <path d="m12-5 9-4V9l-9-4Z" />
              <circle cx="-2" r="4" fill="#34434c" />
            </g>
            <text
              y={index === 2 ? 30 : -22}
              textAnchor="middle"
              fill="#b8c1ca"
              fontFamily="monospace"
              fontSize="12"
            >
              CAM 0{index + 1}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        Conceptual illustration · multi-view triangulation
      </figcaption>
    </MotionFigure>
  );
}
