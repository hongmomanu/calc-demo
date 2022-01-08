import React, { Suspense } from "react";
import PsvSheet from "./calcs/psv-api";
import CircularIndeterminate from "./components/Loading";
const ValvesSheet = React.lazy(() => import("./calcs/valves-api"));
function Content({ navIndex }) {
  switch (navIndex) {
    case 0:
      return (
        <Suspense fallback={<CircularIndeterminate />}>
          <ValvesSheet />
        </Suspense>
      );
    default:
      return <div>12</div>;
  }
}
export default Content;
