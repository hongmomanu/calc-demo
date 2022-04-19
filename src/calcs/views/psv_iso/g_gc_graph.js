import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixed, toFixedTip } from "../../../utils";
import { g_gc_xs, g_gc_ys } from "./data";
function calcApi({ setCalcFormData, calcFormData, url }) {
  httpPost({
    url,
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function GGcGraph() {
  const [calcFormData, setCalcFormData] = useState({
    op: 0.1,
    pp: 0.8,
  });
  useEffect(() => {
    debCalcApi({
      url:'/api/gGcGraph/valveflow',  
      calcFormData: {
        ...calcFormData,
      },
      setCalcFormData,
    });
  }, [
    calcFormData.op,
    calcFormData.pp
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Correction factor for subcritical flow regime
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Omega parameter (w)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c ">
          <NumberInput
            data={calcFormData}
            name="op"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure ratio (Pc/P0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c ">
          {toFixedTip(calcFormData.cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Pb/P0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c ">
        <NumberInput
            data={calcFormData}
            name="pp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">(1-Pb/P0)/(1-Pc/P0)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c ">
          {toFixedTip(calcFormData.pppp)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Regime</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c ">
          {calcFormData.regime}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Correction factor (G/Gc)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c ">
          {toFixedTip(calcFormData.cf)}
        </div>
      </Grid>

      <Grid item xs={12}>
      <Charts
          xData={g_gc_xs}
          xTickCount={10}
          yTickCount={8}
          xScale={'log'}
          yScale={'log'}
          xTicks = {[0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08,0.09,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]}
          yTicks = {[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]}
          xDomain={['auto', 'auto']}
          yDomain={['auto', 'auto']}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.frf,
              Current: calcFormData.np_cfr,
            },
          ]}
          yDatas={g_gc_ys.map((it)=>it.ys)}
          columns={g_gc_ys.map((it)=>it.name)}
        />
      </Grid>

    </Grid>
  );
}
