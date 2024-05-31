"use client";

import { divIcon, icon, marker } from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface ClickableMapProps {
  userOrigin: [number, number];
  destination: [number, number] | null;
  setOrigin: React.Dispatch<React.SetStateAction<[number, number]>>;
  setDestination: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  // destinationMarker: [number, number] | null;
  // setDestinationMarker: React.Dispatch<
  //   React.SetStateAction<[number, number] | null>
  // >;
  distance: number | null;
  setDistance: React.Dispatch<React.SetStateAction<number | null>>;
}

const ClickableMap: React.FC<ClickableMapProps> = ({
  userOrigin,
  destination,
  setOrigin,
  setDestination,
  // destinationMarker,
  // setDestinationMarker,
  distance,
  setDistance,
}) => {
  const iconSizeOther: [number, number] = [60, 60];
  // const ORIGIN_ICON = icon({
  //   iconUrl: "/origin-icon.svg",
  //   iconSize: iconSizeOther,
  // });

  const ORIGIN_ICON = L.icon({
    iconUrl: "/origin-icon.svg",
    iconSize: iconSizeOther,
  });

  const DESTINATION_ICON = L.icon({
    iconUrl: "/destination-icon.svg",
    iconSize: iconSizeOther,
  });

  // const [isMounted, setIsMounted] = useState(true);

  // useEffect(() => {
  //   // Set isMounted to false when the component unmounts
  //   return () => setIsMounted(false);
  // }, []);

  // useEffect(() => {
  //   if (isMounted && routingControlRef.current) {
  //     map.removeControl(routingControlRef.current);
  //     routingControlRef.current = null;
  //   }
  // }, [destination, isMounted]);

  // const [distance, setDistance] = useState<number | null>(null);

  useMapEvents({
    click: (e) => {
      setDestination([e.latlng.lat, e.latlng.lng]);
      const distanceInMeters = e.latlng.distanceTo(userOrigin);
      setDistance(distanceInMeters);
    },
  });

  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    try {
      if (destination) {
        // Remove the old routing control if it exists
        if (routingControlRef && routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }

        // Create a new routing control and add it to the map

        const waypoints = [
          L.latLng(userOrigin[0], userOrigin[1]),
          L.latLng(destination[0], destination[1]),
        ];

        const routingControl = L.Routing.control({
          // waypoints: [
          //   L.latLng(userPosition[0], userPosition[1]),
          //   L.latLng(marker[0], marker[1]),
          // ],
          // waypoints: waypoints,

          router: new (L.Routing.osrmv1 as any)({
            serviceUrl: "https://router.project-osrm.org/route/v1",
          }),
          lineOptions: {
            styles: [{ color: "blue", opacity: 1, weight: 5 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0.02,
          },
          show: false,
          collapsible: false,
          addWaypoints: false,
          fitSelectedRoutes: true,
          routeWhileDragging: false,
          showAlternatives: true,
          plan: L.Routing.plan(waypoints, {
            createMarker: function (i, waypoint, n) {
              const marker = L.marker(waypoint.latLng, {
                icon: i === 0 ? ORIGIN_ICON : DESTINATION_ICON,
                draggable: true,
              });

              marker.on("dragend", function (e) {
                const newLatLng = e.target.getLatLng();
                if (i === 0) {
                  setOrigin([newLatLng.lat, newLatLng.lng]);
                } else if (i === 1) {
                  setDestination([newLatLng.lat, newLatLng.lng]);
                }

                // Calculate the distance between the origin and destination
                const originLatLng =
                  i === 0 ? newLatLng : L.latLng(userOrigin[0], userOrigin[1]);
                const destinationLatLng =
                  i === 1
                    ? newLatLng
                    : L.latLng(destination[0], destination[1]);
                const distanceInMeters =
                  originLatLng.distanceTo(destinationLatLng);
                setDistance(distanceInMeters);
              });

              return marker;
            },
          }),
        }).addTo(map);

        routingControlRef.current = routingControl;

        // Return a cleanup function
        return () => {
          if (routingControlRef && routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            map.removeLayer(routingControlRef.current.getPlan());

            routingControlRef.current = null;
          }
        };
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [destination]);

  // useEffect(() => {
  //   console.log("distance", distance);
  // }, [distance]);

  return null;
};

const MapContainerComponent = ({
  origin,
  destination,
  setOrigin,
  setDestination,
  distance,
  setDistance,
}: {
  origin: [number, number];
  destination: [number, number] | null;
  setOrigin: React.Dispatch<React.SetStateAction<[number, number]>>;
  setDestination: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  distance: number | null;
  setDistance: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const iconSize: [number, number] = [100, 100];
  const iconSizeOther: [number, number] = [60, 60];

  // const [destinationMarker, setDestinationMarker] = useState<
  //   [number, number] | null
  // >(null);

  // const [position, setPosition] = useState<[number, number]>([0, 0]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     setPosition([position.coords.latitude, position.coords.longitude]);
  //   });
  // }, []);

  const ICON = divIcon({
    className: "custom-icon",
    html: `
        <div style='width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;'>
          <div style='width: ${iconSize[0] / 2}px; height: ${
      iconSize[1] / 2
    }px; position: absolute; background-color: #1F619F; border-radius: 50%;'></div>
          <div class='pulseCircle2' style='width: ${iconSize[0]}px; height: ${
      iconSize[1]
    }px; position: absolute; background-color: #1F619F; border-radius: 50%;'></div>
        </div>
      `,
    iconSize: iconSize,
  });

  const ORIGIN_ICON = icon({
    iconUrl: "/origin-icon.svg",
    iconSize: iconSizeOther,
  });

  return (
    <div className="z-0 w-screen h-full flex flex-col relative overflow-hidden">
      <div className="w-full bg-white shadow-lg flex justify-between rounded-xl h-full overflow-hidden">
        <MapContainer
          center={origin}
          zoom={17}
          zoomControl={false}
          attributionControl={false}
          // scrollWheelZoom={false}
          className="h-full"
          style={{ width: "100%", height: "100svh" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tile layer URL
          />
          {destination === null && (
            <Marker
              position={origin}
              icon={ICON}
              // icon={ORIGIN_ICON}
            />
          )}
          <ClickableMap
            userOrigin={origin}
            destination={destination}
            setOrigin={setOrigin}
            setDestination={setDestination}
            // destinationMarker={destinationMarker}
            // setDestinationMarker={setDestinationMarker}
            distance={distance}
            setDistance={setDistance}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapContainerComponent;
