import { resolveSiteUrl } from "./site-url";

export const SITE_URL = resolveSiteUrl();
export const site = {
  name: "Jegors Dorofejevs",
  handle: "Hold404",
  role: "CTO at Robotics Startup and Software engineer",
  description:
    "Jegors Dorofejevs is a software engineer and CTO at Robotics Startup in Enschede, Netherlands, working on robotics software delivery and backend systems.",
  email: "jegors.s.dorofejevs@gmail.com",
  location: "Enschede, Netherlands",
  github: "https://github.com/Hold404",
  linkedin: "https://www.linkedin.com/in/hold404",
} as const;

export const publicRoutes = [
  "/",
  "/work",
  "/work/robotics-startup",
  "/work/domido",
  "/work/virtuosohub",
  "/projects",
  "/projects/volleyball-tracking",
  "/writing",
  "/about",
  "/contact",
] as const;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
