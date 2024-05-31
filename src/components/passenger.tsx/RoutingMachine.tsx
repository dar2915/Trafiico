import L, { LatLngExpression, ControlOptions, Control } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

interface Props extends ControlOptions {
  waypoint1: LatLngExpression;
  waypoint2: LatLngExpression;
}

const createRoutineMachineLayer = (props: Props): Control => {
  const instance = L.Routing.control({
    waypoints: [L.latLng(props.waypoint1), L.latLng(props.waypoint2)],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 0.2,
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
  } as any); // Use a type assertion here

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
