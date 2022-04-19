import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { httpPost } from "../../../http";
import { debounce, toFixed, toFixedTip } from "../../../utils";
import { faning_ys, fanning_xs } from "./data";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/fanning/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function Fanning() {
  const [calcFormData, setCalcFormData] = useState({
    r: 0.001,
    /**
     * Rugosity ( r )
     */
    r_new_unit: "mm",
    /**
     * Rugosity ( r )
     */
    r_old_unit: "mm",
    /**
     * Rugosity ( r )
     */
    pd: 0.1,
    /**
     * Pipe diameter (D)
     */
    pd_new_unit: "m",
    /**
     * Pipe diameter (D)
     */
    pd_old_unit: "m",
    /**
     * Pipe diameter (D)
     */
    reynolds: 100000,
    /**
     * Reynolds
     */
  });
  const r_old_unit =
    usePrevious(calcFormData.r_new_unit) || calcFormData.r_new_unit;
  const pd_old_unit =
    usePrevious(calcFormData.pd_new_unit) || calcFormData.pd_new_unit;

  useEffect(() => {
    debCalcApi({
      calcFormData: {
        ...calcFormData,
        ...{ r_old_unit, pd_old_unit },
      },
      setCalcFormData,
    });
  }, [
    calcFormData.r,
    calcFormData.r_new_unit,
    calcFormData.pd,
    calcFormData.pd_new_unit,
    calcFormData.reynolds,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Friction factor function of relative rugosity
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Rugosity ( r )</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {Combox({
            options: [
              { name: "m", value: "m" },
              { name: "mm", value: "mm" },
              { name: "inch", value: "inch" },
              { name: "ft", value: "ft" },
            ],
            data: calcFormData,
            name: "r_new_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            deceil={6}
            data={calcFormData}
            name="r"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Pipe diameter (D)</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {Combox({
            options: [
              { name: "m", value: "m" },
              { name: "mm", value: "mm" },
              { name: "inch", value: "inch" },
              { name: "ft", value: "ft" },
            ],
            data: calcFormData,
            name: "pd_new_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="pd"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Reynolds</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          <NumberInput
            data={calcFormData}
            name="reynolds"
            setFunc={setCalcFormData}
          />
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">Relative rugosity (eps)</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.rr, 5)}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 b-1-gray">
          fanning friction factor (f)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c h-30 f-j-c  b-1-gray">
          {toFixedTip(calcFormData.fff)}
        </div>
      </Grid>

      <Grid style={{ height: "560px" }} item xs={11}>
        <Charts
          xData={fanning_xs}
          legendStyle={{ bottom: "-20px" }}
          xScale={"log"}
          xTickFormatter={(val, ix) => {
            const filterArr = [100, 1000, 10000, 100000, 1000000, 10000000];
            if (filterArr.includes(val)) return val;
            else return "";
          }}
          xTicks={[
            100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000,
            5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000, 40000, 50000,
            60000, 70000, 80000, 90000, 100000, 200000, 300000, 400000, 500000,
            600000, 700000, 800000, 900000, 1000000, 2000000, 3000000, 4000000,
            5000000, 6000000, 7000000, 8000000, 9000000, 10000000,
          ]}
          yTicks={[0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03]}
          xDomain={["auto", "auto"]}
          yDomain={["auto", "auto"]}
          scatters={["Current"]}
          scatters_data={[
            {
              name: calcFormData.reynolds,
              Current: calcFormData.fff,
            },
          ]}
          yDatas={faning_ys.map((it) => it.ys)}
          columns={faning_ys.map((it) => it.name)}
        />
      </Grid>
    </Grid>
  );
}
