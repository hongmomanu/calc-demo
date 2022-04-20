import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/tank/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function Tank() {
  const [calcFormData, setCalcFormData] = useState({
    press: 0.5,
    liqH: 7.0,
    holeh: 5.0,
    rhol: 1395.3081005,
    disch: 1.0,
  });
  useEffect(() => {
    debCalcApi({
      calcFormData,
      setCalcFormData,
    });
  }, [
    calcFormData.press,
    calcFormData.liqH,
    calcFormData.holeh,
    calcFormData.rhol,
    calcFormData.disch,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Liquid spray from tank</div>
        <div>Solvay GEC-PEE-NOH/PJR version 1.1</div>
      </Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Top pressure (P)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">barg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="press"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Liquid height (H)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="liqH"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Hole height (h)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="holeh"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Liquid density</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/m3</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="rhol"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={12}>
      <div className="fl f-a-c h-30"></div>
      </Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Pressure at hole level</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">barg</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.holep)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Discharge coefficient</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="disch"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Liquid velocity</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.liqv)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Distance from wall (x)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.dfw)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={12}>
      <div className="fl f-a-c h-30"></div>
      </Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Maximum distance (xmax)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.md)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">at h</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.holehmax)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={11}>
        <Charts
              
              xData={[calcFormData.xs || []]}
            //   yDomain={[0, Math.max(...calcFormData.ys||[])]}
              yTickSize={10}
              xTickSize={5}
              scatters={["hole height","at h"]}
              scatters_data={[
                {
                  name: calcFormData.holeh || 0,
                  "hole height": calcFormData.dfw || 0,
                },
                {
                    name: calcFormData.holehmax || 0,
                    "at h": calcFormData.md || 0,
                  },
              ]}
              yDatas={[calcFormData.ys || []]}
              columns={["x as function h"]}
            />
      </Grid>
      <Grid item xs={1}></Grid>


    </Grid>
  );
}
