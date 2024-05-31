import DashboardPassengerComponent from "@/components/passenger.tsx/Dashboard";
import Redirect from "@/utils/Redirect";

export default function Report() {
  return (
    <Redirect>
      <DashboardPassengerComponent />
    </Redirect>
  );
}
