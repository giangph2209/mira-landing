"use client";

import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  createCoordinates,
} from "@vnedyalk0v/react19-simple-maps";
import Reveal from "@/components/ui/Reveal";

type RegionMarker = {
  id: string;
  name: string;
  projects: number;
  coordinates: [number, number];
  flagCode: string;
};

const MARKERS: RegionMarker[] = [
  {
    id: "us",
    name: "United States",
    projects: 120,
    coordinates: [-98, 39],
    flagCode: "us",
  },
  {
    id: "ru",
    name: "Russia",
    projects: 120,
    coordinates: [100, 61],
    flagCode: "ru",
  },
  {
    id: "vn",
    name: "Vietnam",
    projects: 120,
    coordinates: [106, 16],
    flagCode: "vn",
  },
  {
    id: "jp",
    name: "Japan",
    projects: 120,
    coordinates: [138, 36],
    flagCode: "jp",
  },
  {
    id: "au",
    name: "Australia",
    projects: 220,
    coordinates: [134, -25],
    flagCode: "au",
  },
];

function MarkerCard({
  marker,
  visible,
  delayMs,
}: {
  marker: RegionMarker;
  visible: boolean;
  delayMs: number;
}) {
  return (
    <g
      className="origin-center transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transitionDelay: `${delayMs}ms`,
      }}
    >
      <foreignObject
        x={-168}
        y={-24}
        width={156}
        height={68}
        className="hidden lg:block"
      >
        <div className="rounded-xl border border-[#b8e6c4] bg-white px-3 py-2 text-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-xs font-bold leading-none text-text-dark">
              {marker.projects}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-text-gray">
              Project
            </span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="text-xs font-medium text-text-dark">
              {marker.name}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w40/${marker.flagCode}.png`}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px] rounded-full object-cover ring-1 ring-black/5"
            />
          </div>
        </div>
      </foreignObject>

      <circle r={5} fill="#0e803f" className="animate-region-pulse" />
      <circle
        r={9}
        fill="#0e803f"
        fillOpacity={0.18}
        className="animate-region-pulse"
      />
    </g>
  );
}

function RegionListCard({ marker }: { marker: RegionMarker }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#b8e6c4] bg-white px-4 py-3 shadow-[0_4px_16px_rgba(14,128,63,0.08)]">
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-text-dark">
            {marker.projects}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-gray">
            Project
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-text-dark">
          {marker.name}
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w40/${marker.flagCode}.png`}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 rounded-full object-cover ring-1 ring-black/5"
      />
    </div>
  );
}

export default function RegionSection() {
  const [ready, setReady] = useState(false);
  const [geoData, setGeoData] = useState<object | null>(null);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/geo/countries-110m.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setGeoData(data);
          window.setTimeout(() => setReady(true), 120);
        }
      })
      .catch(() => {
        if (!cancelled) setGeoError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="region" className="bg-white py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <header className="mb-8 text-center sm:mb-10 lg:mb-12">
            <h2 className="font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-primary">
              Khu vực khách hàng
            </h2>
          </header>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative mx-auto flex min-h-[200px] w-full max-w-[1100px] items-center justify-center overflow-hidden lg:overflow-visible">
            {geoError ? (
              <p className="text-sm text-text-gray">
                Không tải được dữ liệu bản đồ.
              </p>
            ) : !geoData ? (
              <div
                className="h-10 w-10 animate-pulse rounded-full bg-primary/20"
                aria-label="Loading map"
              />
            ) : (
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{
                  scale: 168,
                  center: createCoordinates(20, 8),
                }}
                width={900}
                height={440}
                className="h-auto w-full"
              >
                <Geographies geography={geoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "#b8e6c4",
                            stroke: "#ffffff",
                            strokeWidth: 0.6,
                            outline: "none",
                          },
                          hover: {
                            fill: "#9ad9ab",
                            stroke: "#ffffff",
                            strokeWidth: 0.6,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#9ad9ab",
                            stroke: "#ffffff",
                            strokeWidth: 0.6,
                            outline: "none",
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {MARKERS.map((marker, index) => (
                  <Marker
                    key={marker.id}
                    coordinates={createCoordinates(...marker.coordinates)}
                  >
                    <MarkerCard
                      marker={marker}
                      visible={ready}
                      delayMs={180 + index * 140}
                    />
                  </Marker>
                ))}
              </ComposableMap>
            )}
          </div>
        </Reveal>

        {/* Mobile / tablet: readable region cards */}
        <Reveal delay={160}>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {MARKERS.map((marker) => (
              <RegionListCard key={marker.id} marker={marker} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
