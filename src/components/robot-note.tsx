import {
  boxRestPosition,
  restingRobotPose,
  robotKeyframes,
} from "@/lib/robot-motion";
import { MotionFigure } from "./motion-figure";

export function RobotNote() {
  return (
    <MotionFigure className="robot-note">
      <style>{robotKeyframes}</style>
      <svg
        viewBox="30 10 370 310"
        role="img"
        aria-labelledby="robot-note-title robot-note-description"
      >
        <title id="robot-note-title">A robot arm</title>
        <desc id="robot-note-description">
          A conceptual industrial manipulator with articulated links, joint
          housings, a cable route, and a gripper that picks up a box and puts it
          back on its platform. This is an illustration of robotics, not an
          actual hardware demonstration.
        </desc>
        <g fill="none" stroke="#343e46" strokeWidth="1">
          <path d="M48 300h334M70 310h290M57 48v232m-7-220h14m-14 207h14" />
          <path d="M67 120a134 134 0 0 1 222-51" strokeDasharray="3 7" />
        </g>
        <g fill="none" stroke="#53616c" strokeWidth="1.5">
          <path d="M298 292h60v8h-60ZM305 300v9m46-9v9" />
        </g>
        <g
          className="robot-box robot-motion"
          style={{
            transform: `translate(${boxRestPosition.x}px,${boxRestPosition.y}px)`,
          }}
        >
          <rect
            x="-19"
            y="-18"
            width="38"
            height="36"
            rx="1"
            fill="#594735"
            stroke="#c6a17c"
            strokeWidth="1.5"
          />
          <path
            d="M-18-8h36M-3-18v10h6v-10"
            fill="none"
            stroke="#b8946e"
            strokeWidth="1.2"
          />
          <path d="M-12 10h9m-9 4h6" stroke="#d4b28c" strokeWidth="1" />
        </g>
        <g stroke="#aab6bf" strokeWidth="2" strokeLinejoin="round">
          <path d="M99 280h94l16 17H83Z" fill="#242c32" />
          <path d="M118 280v-35l18-18h21l18 18v35Z" fill="#1b2228" />
          <path
            d="M126 280v-30l12-12h17l12 12v30"
            fill="none"
            stroke="#53616c"
          />
          <g transform="translate(146 246)">
            <g
              className="robot-shoulder robot-motion"
              style={{ transform: `rotate(${restingRobotPose.shoulder}deg)` }}
            >
              <path d="m-15-1-43-100 30-13L17-8Z" fill="#2b343b" />
              <path d="m-6-14-37-85 10-5L4-18" fill="#3a4650" stroke="none" />
              <path
                d="M-23 5c-24-26-45-78-45-110"
                fill="none"
                stroke="#73838f"
                strokeWidth="3"
              />
              <g transform="translate(-42 -107)">
                <g
                  className="robot-elbow robot-motion"
                  style={{ transform: `rotate(${restingRobotPose.elbow}deg)` }}
                >
                  <path d="m-7-14 134-70 15 28L9 17Z" fill="#2b343b" />
                  <path
                    d="m16-14 108-56 5 10L20-4"
                    fill="#3a4650"
                    stroke="none"
                  />
                  <path
                    d="M-9-24 117-88"
                    fill="none"
                    stroke="#73838f"
                    strokeWidth="3"
                  />
                  <g transform="translate(134 -68)">
                    <g
                      className="robot-wrist robot-motion"
                      style={{
                        transform: `rotate(${restingRobotPose.wrist}deg)`,
                      }}
                    >
                      <path d="m9-10 66 59-25 23-60-60Z" fill="#2b343b" />
                      <path
                        d="m13 5 48 45-9 7-47-44"
                        fill="#3a4650"
                        stroke="none"
                      />
                      <path
                        d="m19-15 67 62"
                        fill="none"
                        stroke="#73838f"
                        strokeWidth="3"
                      />
                      <g transform="translate(61 61)">
                        <g
                          className="robot-tool robot-motion"
                          style={{
                            transform: `rotate(${restingRobotPose.tool}deg)`,
                          }}
                        >
                          <path d="M-12 2h24l7 9v9h-38v-9Z" fill="#20282f" />
                          <path
                            d="M-11 13h22"
                            stroke="#53616c"
                            strokeWidth="3"
                          />
                          <g transform="translate(20 20)">
                            <path
                              className="robot-jaw-right robot-motion"
                              style={{
                                transform: `rotate(${restingRobotPose.rightJaw}deg)`,
                              }}
                              d="M0 0v30h-5"
                              fill="none"
                              strokeWidth="3"
                            />
                          </g>
                          <g transform="translate(-20 20)">
                            <path
                              className="robot-jaw-left robot-motion"
                              style={{
                                transform: `rotate(${restingRobotPose.leftJaw}deg)`,
                              }}
                              d="M0 0v30h5"
                              fill="none"
                              strokeWidth="3"
                            />
                          </g>
                        </g>
                        <circle r="13" fill="#151a1e" stroke="#c6a17c" />
                        <circle r="5" fill="#303b44" stroke="#8f9ca6" />
                      </g>
                    </g>
                    <circle r="20" fill="#151a1e" stroke="#c6a17c" />
                    <circle r="11" fill="#27323a" stroke="#8f9ca6" />
                    <path
                      d="M-4 0h8M0-4v8"
                      stroke="#c6a17c"
                      strokeWidth="1.5"
                    />
                  </g>
                </g>
                <circle r="23" fill="#151a1e" stroke="#c6a17c" />
                <circle r="14" fill="#27323a" stroke="#8f9ca6" />
                <circle r="5" fill="#c6a17c" stroke="none" />
                <path
                  d="M0-18v3M18 0h-3M0 18v-3M-18 0h3"
                  stroke="#788792"
                  strokeWidth="1.5"
                />
              </g>
              <circle r="24" fill="#151a1e" stroke="#c6a17c" />
              <circle r="15" fill="#27323a" stroke="#8f9ca6" />
              <circle r="5" fill="#c6a17c" stroke="none" />
              <path
                d="M0-20v3M20 0h-3M0 20v-3M-20 0h3"
                stroke="#788792"
                strokeWidth="1.5"
              />
            </g>
          </g>
        </g>
        <g fill="#77858f">
          <circle cx="102" cy="290" r="2" />
          <circle cx="189" cy="290" r="2" />
        </g>
      </svg>
    </MotionFigure>
  );
}
