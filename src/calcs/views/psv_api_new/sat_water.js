import { Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { httpPost } from "../../../http";
import { debounce, toFixed, toFixedTip } from "../../../utils";
import { PatmContext } from "../../context";
import chatImg from "./chat2.png";
function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/setwater/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function SatWater() {
  const patmContext = useContext(PatmContext);
  const [calcFormData, setCalcFormData] = useState({
    sp: 50,
    /**
     * Set pressure
     */
    sp_new_unit: "barg",
    /**
     * Set pressure
     */
    sp_old_unit: "barg",
    /**
     * Set pressure
     */
    ssf: 5.55555556,
    /**
     * Saturated steam flowrate
     */
    ssf_new_unit: "kg/s",
    /**
     * Saturated steam flowrate
     */
    ssf_old_unit: "kg/s",
    /**
     * Saturated steam flowrate
     */
    fc_unit: "kg/s.m2",
    /**
     * ASME BPVC Section VIII div1-2010, appendix 11
     * Flow cap.
     */
    area_unit: "cm2",
    /**
     * ASME BPVC Section VIII div1-2010, appendix 11
     * Area
     */
    overpressure1: 0.1,
    /**
     * By integration (Isenthalpic expansion)
     * Overpressure
     */
    k1: 0.9,
    /**
     * By integration (Isenthalpic expansion)
     * k
     */
    overpressure2: 0.1,
    /**
     * By integration (Isentropic expansion)
     * Overpressure
     */
    k2: 0.9,
    /**
     * By integration (Isentropic expansion)
     * k
     */
    patm: patmContext.bar,
  });
  const ssf_old_unit = usePrevious(calcFormData.ssf_new_unit);
  const sp_old_unit = usePrevious(calcFormData.sp_new_unit);
  useEffect(() => {
    calcFormData.patm = patmContext.bar;
    setCalcFormData({ ...calcFormData });
  }, [patmContext]);

  useEffect(() => {
    debCalcApi({
      calcFormData: { ...calcFormData, ...{ sp_old_unit, ssf_old_unit } },
      setCalcFormData,
    });
  }, [
    calcFormData.sp_new_unit,
    calcFormData.ssf_new_unit,
    calcFormData.sp,
    calcFormData.ssf,
    calcFormData.fc_unit,
    calcFormData.area_unit,
    calcFormData.overpressure1,
    calcFormData.k1,
    calcFormData.k2,
    calcFormData.overpressure2,
    patmContext.bar,
  ]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Saturated water capacity for ASME Certified PSV
        </div>

        <div className="fl f-a-c h-30">
          {`Patm=${patmContext.bar}(bar)/${patmContext.psi}(psi)`}
        </div>
      </Grid>

      <Grid item xs={4}>
        <Grid container>
          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Set pressure</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                minWidth: 80,
                options: [
                  { name: "bar", value: "bar" },
                  { name: "psi", value: "psi" },
                  { name: "Pa", value: "Pa" },
                  { name: "bara", value: "bara" },
                  { name: "psia", value: "psia" },
                  { name: "psig", value: "psig" },
                  { name: "barg", value: "barg" },
                ],
                data: calcFormData,
                name: "sp_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="sp"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Saturated steam flowrate
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                minWidth: 80,
                options: [
                  { name: "kg/h", value: "kg/h" },
                  { name: "kg/s", value: "kg/s" },
                  { name: "lb/h", value: "lb/h" },
                  { name: "t/h", value: "t/h" },
                ],
                data: calcFormData,
                name: "ssf_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="ssf"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="fl f-a-c h-30">
              ASME BPVC Section VIII div1-2010, appendix 11
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Flow cap.</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                minWidth: 80,
                options: [
                  { name: "kg/s.m2", value: "kg/s.m2" },
                  { name: "kg/h.m2", value: "kg/h.m2" },
                  { name: "kg/s.cm2", value: "kg/s.cm2" },
                  { name: "lb/s.ft2", value: "lb/s.ft2" },
                  { name: "lb/h.in2", value: "lb/h.in2" },
                  { name: "lb/h.ft2", value: "lb/h.ft2" },
                ],
                data: calcFormData,
                name: "fc_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixedTip(calcFormData.fc)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Area</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                minWidth: 80,
                options: [
                  { name: "m2", value: "m2" },
                  { name: "cm2", value: "cm2" },
                  { name: "ft2", value: "ft2" },
                  { name: "in2", value: "in2" },
                ],
                data: calcFormData,
                name: "area_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixedTip(calcFormData.area)}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="fl f-a-c h-30">
              By integration (Isenthalpic expansion)
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Overpressure</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">%</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              <NumberInput
                step={0.1}
                data={calcFormData}
                name="overpressure1"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">KD</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="k1"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Flow cap.</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.fc_unit}
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixedTip(calcFormData.fc1)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Area</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.area_unit}
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixedTip(calcFormData.area1)}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="fl f-a-c h-30">
              By integration (Isenthalpic expansion)
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Overpressure</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">%</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              <NumberInput
                step={0.1}
                data={calcFormData}
                name="overpressure2"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">KD</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="k2"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Flow cap.</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.fc_unit}
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixedTip(calcFormData.fc2)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Area</div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.area_unit}
            </div>
          </Grid>

          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixedTip(calcFormData.area2)}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={8}>
        <Charts
          xData={[
            calcFormData.asvXs || [],
            calcFormData.lsenthalpicXs || [],
            calcFormData.lsentropicXs || [],
          ]}
          xTickCount={7}
          yTickCount={12}
          yDomain={[0, 60000]}
          // showDot={<CustomizedDot />}
          xDomain={[0, 300]}
          scatters={["fc"]}
          scatters_data={[
            {
              name: calcFormData.sp,
              fc: calcFormData.fc,
            },
          ]}
          yDatas={[
            calcFormData.asvYs,
            calcFormData.lsenthalpicYs,
            calcFormData.lsentropicYs,
          ]}
          columns={["ASME Section VIII", "lsenthalpic", "lsentropic"]}
        />
      </Grid>

      <Grid item xs={12}>
        <img src={chatImg} height={400} />
      </Grid>
    </Grid>
  );
}
