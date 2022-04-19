import React, { Suspense } from "react";
import CircularIndeterminate from "./components/Loading";
const ValvesSheet = React.lazy(() => import("./calcs/valves-api"));
const PdropPipeSheet = React.lazy(() => import("./calcs/pdrop-pipe-sheet"));
const PdropLineSheet = React.lazy(() => import("./calcs/pdrop-line-sheet"));
const PsvScenariousSheet = React.lazy(() => import("./calcs/psv-scenarious-sheet"));
const PsvIsoSheet = React.lazy(() => import("./calcs/psv-iso-sheet"))
const PsvApiNew = React.lazy(() => import("./calcs/psv-api-new"))
const LiquidSpraySheet = React.lazy(() => import("./calcs/liquid-spray"))
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
    case 4:
        return (
            <Suspense fallback={<CircularIndeterminate />}>
                <PsvIsoSheet />
            </Suspense>
            );
    case 5:
        return (
          <Suspense fallback={<CircularIndeterminate />}>
                <PsvApiNew />
            </Suspense>
        );               
    case 6:
        return (
          <Suspense fallback={<CircularIndeterminate />}>
                <LiquidSpraySheet />
            </Suspense>
        );               
    default:
      return <div>12</div>;
  }
}
export default Content;
