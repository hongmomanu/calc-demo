import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/pipe/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function Pipe() {
  const [calcFormData, setCalcFormData] = useState({
    "psp":2,
    "ld":1000,
    "pd":500,
    "hftp":2,
    "ja":0,
    "hd":25,
    "oc":0.68
  });
  useEffect(() => {
    debCalcApi({
      calcFormData,
      setCalcFormData,
    });
  }, [
    calcFormData.psp,
    calcFormData.ld,
    calcFormData.pd,
    calcFormData.hftp,
    calcFormData.ja,
    calcFormData.hd,
    calcFormData.oc,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Liquid jet from a hole in a pipe</div>
        <div>Solvay GEC-PEE-NOH/PJR version 1.1</div>
      </Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Pipe static pressure</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">bara</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="psp"
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
            name="ld"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Pipe diameter (D)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">mm</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pd"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Height of the pipe</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="hftp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={12}>
      <div className="fl f-a-c h-30"></div>
      </Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Jet angle (a)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">degree</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.ja)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Hole diameter (d)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">mm</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="hd"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Orifice coefficient (C)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="oc"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Hole velocity</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m/s</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.hv)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={5}>
        <div className="fl f-a-c h-60 b-1-gray">Flow</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m3/h</div>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">kg/h</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.flow1)}
        </div>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.flow2)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Jet horizontal length (L)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.jhl)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={11}>
        <Charts
              
              xData={[calcFormData.jtXs || []]}
            //   yTickSize={10}
              xTickSize={5}
              yDatas={[calcFormData.jtYs || []]}
              columns={["Jet trajectory"]}
            />
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Angle for Lmax</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">degree</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.afl)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>

      <Grid item xs={5}>
        <div className="fl f-a-c h-30 b-1-gray">Lmax</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">m</div>
      </Grid>

      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.lmax)}
        </div>
      </Grid>
      <Grid item xs={1}></Grid>


      <Grid item xs={11}>
        <Charts
              
              xData={[calcFormData.lxs || []]}
              yTickSize={10}
              xTickSize={5}
              scatters={["Jet","Lmax"]}
              scatters_data={[
                {
                  name: calcFormData.ja || 0,
                  "Jet": calcFormData.jhl || 0,
                },
                {
                    name: calcFormData.afl || 0,
                    "Lmax": calcFormData.lmax || 0,
                  },
              ]}
              yDatas={[calcFormData.lys || []]}
              columns={["L = f(a)"]}
            />
      </Grid>
      <Grid item xs={1}></Grid>


    </Grid>
  );
}
