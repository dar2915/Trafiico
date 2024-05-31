import SignupPassenger from "@/components/passenger.tsx/SignUp";
import Redirect from "@/utils/Redirect";

export default function Signup() {
  return (
    <Redirect>
      <SignupPassenger />
    </Redirect>
  );
}
