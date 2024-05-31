import SigninComponent from "@/components/Signin";
import Redirect from "@/utils/Redirect";

export default function Signin() {
  return (
    <Redirect>
      <SigninComponent />
    </Redirect>
  );
}
