import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { NumberInput } from "../../../components/NumberInput";
import { httpPost } from "../../../http";
import { debounce, toFixed } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData, url }) {
  httpPost({
    url,
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApiOne = debounce(calcApi);
const debCalcApiTwo = debounce(calcApi);
const debCalcApiThree = debounce(calcApi);

function ViewOne() {
  const [calcFormData, setCalcFormData] = useState({
    pp: 0.4,
    op: 5,
    frf: 10,
    inf: 0.1,
  });
  useEffect(() => {
    debCalcApiOne({
      url: "/api/pipeCorrGraph/valveflowOne",
      calcFormData: {
        ...calcFormData,
      },
      setCalcFormData,
    });
  }, [calcFormData.pp, calcFormData.op, calcFormData.frf, calcFormData.inf]);

  return (
    <>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">High vapour {"&"} gassy system</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Pb/P0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Omega parameter (w)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="op"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Flow resistance factor (4f L/D)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="frf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Inclination factor (Fi)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="inf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure ratio</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.n_cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional crit. mass flux
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.n_acmf)}
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle+pipe</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical flow reduction (Gc/G0c)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_cfr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical pressure ratio (P2c/P0)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional crit. mass flux
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_acmf)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Regime</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {calcFormData.np_regime}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Adimensional mass flux</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_amf)}
        </div>
      </Grid>

      <Grid item xs={12}>
        <Charts
          xData={(calcFormData.cmfrs || []).map((it) => it.xs)}
          xTickCount={10}
          yTickCount={8}
          yDomain={[0, 1]}
          xScale={"log"}
          xTickFormatter={(val, ix) => {
            const filterArr = [0.1, 1, 10, 100];
            if (filterArr.includes(val)) return val;
            else return "";
          }}
          xTicks={[
            0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ]}
          xDomain={["auto", "auto"]}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.frf,
              Current: calcFormData.np_cfr,
            },
          ]}
          yDatas={(calcFormData.cmfrs || []).map((it) => it.ys)}
          columns={(calcFormData.cmfrs || []).map((it) => it.w)}
        />
      </Grid>
    </>
  );
}

function ViewTwo() {
  const [calcFormData, setCalcFormData] = useState({
    pp: 0.7,
    hfo: 20,
    gpvf: 0.1,
    gppr: 0.4,
    frf: 10,
    inf: 0.01,
  });
  useEffect(() => {
    debCalcApiTwo({
      url: "/api/pipeCorrGraph/valveflowTwo",
      calcFormData: {
        ...calcFormData,
      },
      setCalcFormData,
    });
  }, [
    calcFormData.pp,
    calcFormData.op,
    calcFormData.gpvf,
    calcFormData.gppr,
    calcFormData.frf,
    calcFormData.inf,
  ]);

  return (
    <>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Hybrid system</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Pb/P0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Hybrid flow omega (ws)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="hfo"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          gas phase volume fraction (a0)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="gpvf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Gas partial pressure ratio (yg0)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="gppr"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Omega parameter (w)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixed(calcFormData.op)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Flow resistance factor (4f L/D)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="frf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Inclination factor (Fi)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="inf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure ratio</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.n_cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional crit. mass flux
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.n_acmf)}
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle+pipe</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical flow reduction (Gc/G0c)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_cfr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical pressure ratio (P2c/P0)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional crit. mass flux
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_acmf)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Regime</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {calcFormData.np_regime}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Adimensional mass flux</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_amf)}
        </div>
      </Grid>

      <Grid item xs={12}>
        <Charts
          xData={calcFormData.xs || []}
          xTickCount={10}
          yTickCount={8}
          yDomain={[0, 1]}
          xScale={"log"}
          xTickFormatter={(val, ix) => {
            const filterArr = [0.1, 1, 10, 100];
            if (filterArr.includes(val)) return val;
            else return "";
          }}
          xTicks={[
            0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ]}
          xDomain={["auto", "auto"]}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.frf,
              Current: calcFormData.np_cfr,
            },
          ]}
          yDatas={(calcFormData.cmfrs || []).map((it) => it.ys)}
          columns={(calcFormData.cmfrs || []).map((it) => it.yg0)}
        />
      </Grid>
    </>
  );
}

function ViewThree() {
  const [calcFormData, setCalcFormData] = useState({
    pp: 0.5,
    hfo: 50,
    psp: 0.7,
    frf: 50,
    inf: 0.01,
  });
  useEffect(() => {
    debCalcApiThree({
      url: "/api/pipeCorrGraph/valveflowThree",
      calcFormData: {
        ...calcFormData,
      },
      setCalcFormData,
    });
  }, [
    calcFormData.pp,
    calcFormData.hfo,
    calcFormData.psp,
    calcFormData.gppr,
    calcFormData.frf,
    calcFormData.inf,
  ]);

  return (
    <>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Subcooled liquid</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Pb/P0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Hybrid flow omega (ws)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="hfo"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Ps/P0</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="psp"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Flow resistance factor (4f L/D)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="frf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Inclination factor (Fi)</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray">
          <NumberInput
            data={calcFormData}
            name="inf"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Critical pressure ratio</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.n_cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional crit. mass flux
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.n_acmf)}
        </div>
      </Grid>

      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Nozzle+pipe</div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical flow reduction (Gc/G0c)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_cfr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Critical pressure ratio (P2c/P0)
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_cpr)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">
          Adimensional crit. mass flux
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_acmf)}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Regime</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {calcFormData.np_regime}
        </div>
      </Grid>

      <Grid item xs={6}>
        <div className="fl f-a-c h-30 b-1-gray">Adimensional mass flux</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c h-30 b-1-gray f-j-c">
          {toFixed(calcFormData.np_amf)}
        </div>
      </Grid>

      <Grid item xs={12}>
        <Charts
          xData={(calcFormData.cmfrs || []).map((it) => it.xs)}
          xTickCount={10}
          yTickCount={8}
          yDomain={[0, 1]}
          xScale={"log"}
          xTickFormatter={(val, ix) => {
            const filterArr = [0.1, 1, 10, 100];
            if (filterArr.includes(val)) return val;
            else return "";
          }}
          xTicks={[
            0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8,
            9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ]}
          xDomain={["auto", "auto"]}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.frf,
              Current: calcFormData.np_cfr,
            },
          ]}
          yDatas={(calcFormData.cmfrs || []).map((it) => it.ys)}
          columns={(calcFormData.cmfrs || []).map((it) => it.w)}
        />
      </Grid>
    </>
  );
}

export default function PipeCorrGraph() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Flow reduction (friction /inclination of vent line)
        </div>
      </Grid>
      <ViewOne />
      <ViewTwo />
      <ViewThree />
    </Grid>
  );
}
