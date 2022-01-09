import React, { Suspense } from "react";
import CircularIndeterminate from "./components/Loading";
const ValvesSheet = React.lazy(() => import("./calcs/valves-api"));
const PdropPipeSheet = React.lazy(() => import("./calcs/pdrop-pipe-sheet"));
function Content({ navIndex }) {
  switch (navIndex) {
    case 0:
      return (
        <Suspense fallback={<CircularIndeterminate />}>
          <ValvesSheet />
        </Suspense>
      );
    case 1:
      return (
        <Suspense fallback={<CircularIndeterminate />}>
          <PdropPipeSheet />
        </Suspense>
      );
    default:
      return <div>12</div>;
  }
}
export default Content;
