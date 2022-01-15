import React, { Suspense } from "react";
import CircularIndeterminate from "./components/Loading";
const ValvesSheet = React.lazy(() => import("./calcs/valves-api"));
const PdropPipeSheet = React.lazy(() => import("./calcs/pdrop-pipe-sheet"));
const PdropLineSheet = React.lazy(() => import("./calcs/pdrop-line-sheet"));
const PsvScenariousSheet = React.lazy(() => import("./calcs/psv-scenarious-sheet"));
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
    case 2:
    return (
        <Suspense fallback={<CircularIndeterminate />}>
            <PdropLineSheet />
        </Suspense>
        );
    case 3:
        return (
            <Suspense fallback={<CircularIndeterminate />}>
                <PsvScenariousSheet />
            </Suspense>
            );       
    default:
      return <div>12</div>;
  }
}
export default Content;
