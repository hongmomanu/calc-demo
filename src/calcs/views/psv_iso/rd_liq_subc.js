import { Grid, TextField } from "@mui/material";
import { PureComponent, useEffect, useState } from "react";
import { Charts } from "../../../components/Charts";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { httpPost } from "../../../http";
import { debounce, toFixed, toFixedTip } from "../../../utils";

function calcApi({ setCalcFormData, calcFormData }) {
  httpPost({
    url: "/api/rdLiqSubc/valveflow",
    params: calcFormData,
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
export default function RdLiqSubc() {
  const [calcFormData, setCalcFormData] = useState({
    urp: 4.4,
    /**
     * Upstream relieving pressure (P0)
     */
    urp_new_unit: "barg",
    /**
     * Upstream relieving pressure (P0)
     */
    urp_old_unit: "barg",
    /**
     * Upstream relieving pressure (P0)
     */
    bp: 0,
    /**
     * Back-pressure (Pb)
     */
    id: 300,
    /**
     * Inlet density (r0 = 1/v0)
     */
    id_new_unit: "kg/m3",
    /**
     * Inlet density (r0 = 1/v0)
     */
    id_old_unit: "kg/m3",
    /**
     * Inlet density (r0 = 1/v0)
     */
    sp: 4,
    /**
     * Saturation pressure (Ps)
     */
    sp_new_unit: "bara",
    /**
     * Saturation pressure (Ps)
     */
    sp_old_unit: "bara",
    /**
     * Saturation pressure (Ps)
     */

    op: 5,
    /**
     * Omega parameter (w)
     */
    d: 50,
    /**
     * Discharge line
     * Diameter (D)
     */
    d_new_unit: "mm",
    /**
     * Discharge line
     * Diameter (D)
     */
    d_old_unit: "mm",
    /**
     * Discharge line
     * Diameter (D)
     */
    l: 10,
    /**
     * Discharge line
     * Length (L)
     */
    l_new_unit: "m",
    /**
     * Discharge line
     * Length (L)
     */
    l_old_unit: "m",
    /**
     * Discharge line
     * Length (L)
     */
    h: 1,
    /**
     * Discharge line
     * Height (H)
     */
    fff: 0.005,
    /**
     * Discharge line
     * Faning friction factor (f)
     */
    frc: 1,
    /**
     * Discharge line
     * Fittings resistance coeff. (K)
     */
    pcs_unit: "cm2",
    /**
     * Discharge line
     * Pipe cross section
     */
    mf_unit: "kg/h",
    /**
     * Nozzle+pipe
     * Mass flow
     */
  });

  const urp_old_unit =
    usePrevious(calcFormData.urp_new_unit) || calcFormData.urp_new_unit;
  const id_old_unit =
    usePrevious(calcFormData.id_new_unit) || calcFormData.id_new_unit;
  const d_old_unit =
    usePrevious(calcFormData.d_new_unit) || calcFormData.d_new_unit;
  const l_old_unit =
    usePrevious(calcFormData.l_new_unit) || calcFormData.l_new_unit;
  const sp_old_unit =
    usePrevious(calcFormData.sp_new_unit) || calcFormData.sp_new_unit;

  useEffect(() => {
    debCalcApi({
      calcFormData: {
        ...calcFormData,
        ...{ urp_old_unit, id_old_unit, d_old_unit, l_old_unit, sp_old_unit },
      },
      setCalcFormData,
    });
  }, [
    calcFormData.urp,
    calcFormData.urp_new_unit,
    calcFormData.bp,
    calcFormData.id,
    calcFormData.id_new_unit,
    calcFormData.sp,
    calcFormData.sp_new_unit,
    calcFormData.op,
    calcFormData.d,
    calcFormData.d_new_unit,
    calcFormData.l,
    calcFormData.l_new_unit,
    calcFormData.h,
    calcFormData.fff,
    calcFormData.frc,
    calcFormData.pcs_unit,
    calcFormData.mf_unit,
  ]);
  return (
    <Grid container>
      <Grid item xs={5}>
        <Grid container>
          <Grid item xs={12}>
            <div className="fl f-a-c h-30">
            Rupture disk checking for subcooled liquid systems
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Case study</div>
          </Grid>
          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              <TextField fullWidth variant="standard" />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Upstream relieving pressure (P0)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {Combox({
                options: [
                  { name: "psig", value: "psig" },
                  { name: "barg", value: "barg" },
                ],
                data: calcFormData,
                name: "urp_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="urp"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Back-pressure (Pb)</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {calcFormData.urp_new_unit}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="bp"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Inlet density (r0 = 1/v0)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {Combox({
                options: [
                  { name: "kg/m3", value: "kg/m3" },
                  { name: "kg/l", value: "kg/l" },
                  { name: "lb/gal", value: "lb/gal" },
                  { name: "lb/ft3", value: "lb/ft3" },
                ],
                data: calcFormData,
                name: "id_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="id"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
            Saturation pressure (Ps)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
            {Combox({
                options: [
                  { name: "bar", value: "bar" },
                { name: "bara", value: "bara" },
                { name: "psi", value: "psi" },
                { name: "psia", value: "psia" },
                ],
                data: calcFormData,
                name: "sp_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 b-1-gray">
              <NumberInput
                data={calcFormData}
                name="sp"
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
            <div className="fl f-a-c h-30 f-j-c b-1-gray">
              <NumberInput
                data={calcFormData}
                name="op"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Ps/P0   (must be  {'<'}= 1)</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.pp0)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Pb/P0</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.pp)}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="fl f-a-c h-30">Discharge line</div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Diameter (D)</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {Combox({
                options: [
                  { name: "m", value: "m" },
                  { name: "mm", value: "mm" },
                  { name: "inch", value: "inch" },
                  { name: "ft", value: "ft" },
                ],
                data: calcFormData,
                name: "d_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              <NumberInput
                data={calcFormData}
                name="d"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Length (L)</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {Combox({
                options: [
                  { name: "m", value: "m" },
                  { name: "mm", value: "mm" },
                  { name: "inch", value: "inch" },
                  { name: "ft", value: "ft" },
                ],
                data: calcFormData,
                name: "l_new_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              <NumberInput
                data={calcFormData}
                name="l"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Height (H)</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {calcFormData.l_new_unit}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              <NumberInput
                data={calcFormData}
                name="h"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Faning friction factor (f)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              <NumberInput
                data={calcFormData}
                name="fff"
                setFunc={setCalcFormData}
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Fittings resistance coeff. (K)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              <NumberInput
                data={calcFormData}
                name="frc"
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
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.frf)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Inclination factor (Fi)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.inf)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Pipe cross section</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {Combox({
                options: [
                  { name: "m2", value: "m2" },
                  { name: "cm2", value: "cm2" },
                  { name: "ft2", value: "ft2" },
                  { name: "in2", value: "in2" },
                ],
                data: calcFormData,
                name: "pcs_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.pcs)}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="fl f-a-c h-30">Nozzle</div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">
              Critical pressure ratio
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.n_cpr)}
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
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.n_acmf)}
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
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.np_cfr)}
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
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.np_cpr)}
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
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.np_acmf)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Regime</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.np_regime)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Adimensional mass flux</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.np_amf)}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c h-30 b-1-gray">Mass flow</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {Combox({
                options: [
                  { name: "kg/h", value: "kg/h" },
                  { name: "kg/s", value: "kg/s" },
                  { name: "lb/h", value: "lb/h" },
                  { name: "t/h", value: "t/h" },
                ],
                data: calcFormData,
                name: "mf_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c h-30 f-j-c  b-1-gray">
              {toFixedTip(calcFormData.np_mf)}
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={7}>
        <Grid container>
          <Grid item xs={12}>
            <Charts
             legendStyle={{bottom:'-15px'}}
              xData={[calcFormData.xs || []]}
              yDomain={['auto', 'auto']}
              yTicks={[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]}
              xScale={"log"}
              xDomain={['auto', "auto"]}
              xTicks={[
                0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6,
                7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
              ]}
              legengHeight={30}
              scatters={["Current"]}
              scatters_data={[
                {
                  name: calcFormData.frf || 0,
                  Current: calcFormData.np_cfr || 0,
                },
              ]}
              yDatas={[calcFormData.ys || []]}
              columns={["w=0.001"]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
