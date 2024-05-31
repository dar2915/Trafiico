// const ClickableMap = () => {
//     // const iconSizeOther: [number, number] = [60, 60];
//     // const ICON_OTHER = icon({
//     //   iconUrl: "/location.png",
//     //   iconSize: iconSizeOther,
//     // });
//     const [markers, setMarkers] = useState<LatLngExpression[]>([]);
//     const map = useMap();
//     const routingControlRef = useRef<L.Routing.Control | null>(null);

//     const [distance, setDistance] = useState<number | null>(null);

//     useMapEvents({
//       click: (e) => {
//         setMarkers((prev) => {
//           if (prev.length === 2) {
//             return [e.latlng];
//           } else {
//             return [...prev, e.latlng];
//           }
//         });
//       },
//     });

//     // useEffect(() => {
//     //   if (markers.length === 2) {
//     //     // Remove the old routing control if it exists
//     //     if (routingControlRef.current) {
//     //       map.removeControl(routingControlRef.current);
//     //     }

//     //     // Create a new routing control and add it to the map
//     //     const routingControl = L.Routing.control({
//     //       waypoints: [
//     //         L.latLng(userPosition[0], userPosition[1]),
//     //         L.latLng(marker[0], marker[1]),
//     //       ],
//     //       router: new (L.Routing.osrmv1 as any)({
//     //         serviceUrl: "https://router.project-osrm.org/route/v1",
//     //       }),
//     //       lineOptions: {
//     //         styles: [{ color: "blue", opacity: 1, weight: 5 }],
//     //         extendToWaypoints: true,
//     //         missingRouteTolerance: 0.02,
//     //       },
//     //       addWaypoints: false,
//     //       fitSelectedRoutes: false,
//     //       showAlternatives: false,
//     //       routeWhileDragging: false,
//     //       // here
//     //     }).addTo(map);

//     //     routingControlRef.current = routingControl;
//     //   }
//     // }, [marker]);

//     useEffect(() => {
//       if (markers.length === 2) {
//         // Remove the old routing control if it exists
//         if (routingControlRef.current) {
//           map.removeControl(routingControlRef.current);
//         }

//         // Create a new routing control and add it to the map
//         const routingControl = L.Routing.control({
//           waypoints: markers.map((marker) => L.latLng(marker)),
//         }).addTo(map);

//         routingControlRef.current = routingControl;
//       }
//     }, [markers, map]);

//     useEffect(() => {
//       console.log("distance", distance);
//     }, [distance]);

//     return (
//       <>
//         {/* {marker ? <Marker position={marker} icon={ICON_OTHER} /> : null} */}
//         {/* {marker ? (
//           <Polyline positions={[userPosition, marker]} color="red" />
//         ) : null} */}
//         {/* {distance ? <p>Distance: {distance} meters</p> : null} */}
//       </>
//     );
//   };

//   <ClickableMap />
