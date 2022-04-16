import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixed } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/hybridGraph/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function HybridGraph() {
  const [calcFormData, setCalcFormData] = useState({
    hfo: 85,
    /**
     * Hybrid flow omega (ws)
     */
    gpvf: 0.4,
    /**
     * gas phase volume fraction (a0)
     */
    gppr: 0.4,
    /**
     * Gas partial pressure ratio (yg0)
     */
    pp: 0.9,
    /**
     * Pb/P0
     */
  });

  useEffect(() => {
    debCalcApi({
      calcFormData: {
        ...calcFormData,
      },
      setCalcFormData,
    });
  }, [calcFormData.hfo, calcFormData.gppr, calcFormData.gpvf, calcFormData.pp]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Hybrid system</div>
      </Grid>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Hybrid flow omega (ws)</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="hfo"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">
          gas phase volume fraction (a0)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="gpvf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">
          Gas partial pressure ratio (yg0)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <NumberInput
          data={calcFormData}
          name="gppr"
          setFunc={setCalcFormData}
        />
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Omega parameter (w)</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.op)}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical pressure ratio (Pc/P0)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.cpr)}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical dimensionless mass flux (G*C)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.cdmf)}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Pb/P0</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="gppr"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Regime</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.regime)}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional mass flux (G*)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.amf)}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">G/Gc</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.gg)}
        </div>
      </Grid>

     <Grid item xs={6}>
     <Charts
          xData={calcFormData.xs || []}
          xTickCount={25}
        //   xinterval={0}
          yTickCount={8}
          yDomain={[0, 1.2]}
          // showDot={<CustomizedDot />}
          xDomain={[0, 1]}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.gpvf,
              Current: calcFormData.cpr,
            },
          ]}
          yDatas={(calcFormData.cprs||[]).map((it)=>it.ys)}
          columns={(calcFormData.cprs||[]).map((it)=>it.yg0)}
        />

     </Grid>

     <Grid item xs={6}>

     <Charts
          xData={calcFormData.xs || []}
          xTickCount={25}
        //   xinterval={0}
          yTickCount={8}
          yDomain={[0, 1.4]}
          // showDot={<CustomizedDot />}
          xDomain={[0, 1]}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.gpvf,
              Current: calcFormData.cdmf,
            },
          ]}
          yDatas={(calcFormData.cdmfs||[]).map((it)=>it.ys)}
          columns={(calcFormData.cdmfs||[]).map((it)=>it.yg0)}
        />


     </Grid>

    </Grid>


  );
}
