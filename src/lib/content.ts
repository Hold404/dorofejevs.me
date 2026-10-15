export type Work = {
  slug: string;
  name: string;
  role: string;
  period: string;
  fullPeriod: string;
  description: string;
  technologies: readonly string[];
  href?: string;
  responsibilities: readonly string[];
};

export const work: readonly Work[] = [
  {
    slug: "robotics-startup",
    name: "Robotics Startup",
    role: "CTO",
    period: "Jul 2026 — Present",
    fullPeriod: "July 2026 – Present",
    href: "/work/robotics-startup",
    description:
      "I lead architecture and engineering for a platform that builds, signs, and delivers software updates to robots. My hands-on work covers release signing, backend reliability, and artifact storage.",
    technologies: [
      "Release signing",
      "OTA updates",
      "CI/CD",
      "Backend systems",
    ],
    responsibilities: [
      "Defining the architecture across hosted builds, release verification, and device updates.",
      "Leading a four-person development team.",
      "Setting the technical roadmap and engineering priorities.",
      "Building signing workers with durable state, idempotency, and failure recovery.",
      "Developing tenant-isolated backend models for device fleets and deployment groups.",
      "Working on artifact storage, build caching, and traceable release records.",
    ],
  },
  {
    slug: "domido",
    name: "DomiDo",
    href: "/work/domido",
    role: "Software Engineer",
    period: "May 2026 — Present",
    fullPeriod: "May 2026 – Present",
    description:
      "I build backend services, APIs, and asynchronous workers at Avvyland Ltd., focusing on retries, failure recovery, and data consistency.",
    technologies: ["Backend systems", "Asynchronous processing", "Reliability"],
    responsibilities: [
      "Backend services and APIs.",
      "Long-running asynchronous workers.",
      "Job execution, retries, and failure recovery.",
      "Service-to-service communication.",
      "Data consistency and backend reliability.",
      "Architecture and operational behavior under concurrent workloads.",
    ],
  },
  {
    slug: "virtuosohub",
    name: "VirtuosoHub",
    role: "Software Engineer",
    period: "Apr 2025 — May 2026",
    fullPeriod: "April 2025 – May 2026",
    href: "/work/virtuosohub",
    description:
      "I worked on distributed CI/CD pipelines, GPU orchestration for real-time AI workloads, and region-aware infrastructure.",
    technologies: [
      "GPU orchestration",
      "Distributed infrastructure",
      "CI/CD",
      "Performance",
    ],
    responsibilities: [
      "Redesigned distributed CI/CD pipelines using parallel builds and selective execution.",
      "Built GPU orchestration supporting dynamic scaling, resource allocation, and workload isolation.",
      "Worked on geographically distributed infrastructure with region-aware deployments, routing, and failover.",
      "Improved frontend performance through architectural changes and rendering optimizations.",
    ],
  },
];

export const volleyball = {
  title: "Volleyball Ball Tracking & Replay System",
  href: "/projects/volleyball-tracking",
  description:
    "I built a system that follows a volleyball across three camera feeds, estimates its 3D position using triangulation, and turns the trajectory into a Blender replay.",
  technologies: ["Python", "YOLO", "Computer vision", "Blender"],
} as const;

export const interests = [
  "Distributed systems",
  "Backend architecture",
  "Cloud infrastructure",
  "CI/CD and developer tooling",
  "Robotics infrastructure",
  "Applied mathematics",
  "Computer vision",
];
