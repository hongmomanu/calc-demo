import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";
import { CheckedBox } from "../../../components/CheckedBox";
import { RadioGroups } from "../../../components/RadioGroup";
function calcApi({ setCalcFormData, calcFormData, ed_old_unit, lh_old_unit }) {
  if (ed_old_unit) calcFormData.ed_old_unit = ed_old_unit;
  if (lh_old_unit) calcFormData.lh_old_unit = lh_old_unit;
  httpPost({ url: "/api/sfifteen/valveflow", params: calcFormData }).then(
    (rep) => {
      delete rep ['ic']
      delete rep ['hco']
      delete rep ['rh']
      delete rep ['dco']
      delete rep ['it']
      delete rep ['dt']
      delete rep ['hv']
      delete rep ['diam']
      delete rep ['h0']
      delete rep ['htot']
      console.log("rep",rep,calcFormData)
      setCalcFormData({ ...calcFormData, ...rep });
    }
  );
}
const debCalcApi = debounce(calcApi);

export default function S15() {
  const [calcFormData, setCalcFormData] = useState({
    diam: 2.2,
    diam_new_unit: "m",
    diam_old_unit: "m",
    h0: 2.5,
    htot: 3.71,
    dco: 0.5,
    hco: 1,
    rh: 0.1,
    vessel_type: 1,
    head_type: 4,
    tv_unit: "m3",
    hliq: 2.5,
    skirt: false,
    ck_uda1: false,
    wa: 18.72,
    wa_new_unit: "m2",
    wa_old_unit: "m2",
    aa: 0,
    th_unit: "kW",
    hv: 274600,
    hv_new_unit: "J/kg",
    hv_old_unit: "J/kg",
    ef_opt: 3,
    ck_tae: false,
    ic: 0.58,
    ic_new_unit: "W/m.K",
    ic_old_unit: "W/m.K",
    it: 254,
    it_new_unit: "mm",
    it_old_unit: "mm",
    dt: 200,
    dt_new_unit: "C",
    dt_old_unit: "C",
    dflow1_unit: "kg/h",
    ck_uda2: false,
    ea: 23.29,
    ea_new_unit: "m2",
    ea_old_unit: "m2",
    mw: 94,
    mw_unit:'kg/kmol',
    rp: 2.21,
    rp_new_unit: "bara",
    rp_old_unit: "bara",
    tw: 593,
    tdisch: 454,
    dflow1: 10271,
    dflow2: 226,
    ef: 1,
    th: 783,
    lv: 8.806,
    tv: 12.709,
  });
  const dt_old_unit = usePrevious(calcFormData.dt_new_unit);
  const diam_old_unit = usePrevious(calcFormData.diam_new_unit);
  const ea_old_unit = usePrevious(calcFormData.ea_new_unit);
  const hv_old_unit = usePrevious(calcFormData.hv_new_unit);
  const it_old_unit = usePrevious(calcFormData.it_new_unit);
  const rp_old_unit = usePrevious(calcFormData.rp_new_unit);
  const wa_nold_unit = usePrevious(calcFormData.wa_new_unit);
  useEffect(() => {
    debCalcApi({
      setCalcFormData,
      calcFormData,
      dt_old_unit,
      diam_old_unit,
      ea_old_unit,
      hv_old_unit,
      it_old_unit,
      rp_old_unit,
      wa_nold_unit,
    });
  }, [
    calcFormData.diam,
    calcFormData.diam_new_unit,
    calcFormData.h0,
    calcFormData.htot,
    calcFormData.hliq,
    calcFormData.aa,
    calcFormData.hv,
    calcFormData.dt_new_unit,
    calcFormData.ea_new_unit,
    calcFormData.hv_new_unit,
    calcFormData.it_new_unit,
    calcFormData.rp_new_unit,
    calcFormData.wa_new_unit,
    calcFormData.dflow1_unit,
    calcFormData.skirt,
    calcFormData.ck_tae,
    calcFormData.ef_opt,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Scenario: Exterior Fire</div>
      </Grid>

      <Grid container>
        <Grid item xs={4}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Case study</div>
        </Grid>
        <Grid item xs={8}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            <NumberInput type="text" />
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">Vessel geometry</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Vessel diameter (D)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "m", value: "m" },
                    { name: "mm", value: "mm" },
                    { name: "inch", value: "inch" },
                    { name: "ft", value: "ft" },
                  ],
                  data: calcFormData,
                  name: "diam_new_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "diam",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Bottom vessel level / ground (H0)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.diam_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "h0",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Total height (Htot)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.diam_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "htot",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Conical basis diameter
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.diam_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.dco)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Conical height</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.diam_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.hco)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Roof height</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.diam_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.rh)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Total volume</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "m3", value: "m3" },
                    { name: "cm3", value: "cm3" },
                    { name: "l", value: "l" },
                    { name: "dm3", value: "dm3" },
                    { name: "gal", value: "gal" },
                    { name: "ft3", value: "ft3" },
                  ],
                  data: calcFormData,
                  name: "tv_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.tv)}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container direction="column" style={{padding:'0px 12px'}}>
            {Combox({
              options: [
                { name: "Vertical cylinder", value: 1 },
                { name: "Horizontal cylinder", value: 2 },
                { name: "Spherical", value: 3 },
                { name: "Vertical cylinder on", value: 4 },
              ],
              data: calcFormData,
              name: "vessel_type",
              setFunc: setCalcFormData,
            })}
            {Combox({
              options: [
                { name: "Semi-eliptic head", value: 1 },
                { name: "Decimal head", value: 2 },
                { name: "spherical head", value: 3 },
                { name: "Elipitical hdea(2:1)", value: 4 },
                { name: "Elipitical hdea(1.9)", value: 5 },
                { name: "Flat head", value: 6 },
                { name: "Flat bottom / conica", value: 7 },
                { name: "Flat bottom / spherical", value: 8 },
              ],
              data: calcFormData,
              name: "head_type",
              setFunc: setCalcFormData,
            })}
              {CheckedBox({
                data: calcFormData,
                name: "skirt",
                setFunc: setCalcFormData,
                label: "bottom head area not include",
              })}
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">
            1. Vessel containing a liquid phase:
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Liquid height (Hliq)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.diam_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "hliq",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Wetted area (A1)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "m2", value: "m2" },
                    { name: "cm2", value: "cm2" },
                    { name: "ft2", value: "ft2" },
                    { name: "in2", value: "in2" },
                  ],
                  data: calcFormData,
                  name: "wa_new_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.wa)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Liquid volume</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.tv_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.lv)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Additional wetted area (A2)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.wa_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "aa",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Transmitted heat (Q)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "W", value: "W" },
                    { name: "kW", value: "kW" },
                    { name: "Btu/h", value: "Btu/h" },
                    { name: "kcal/h", value: "kcal/h" },
                    { name: "hp", value: "hp" },
                  ],
                  data: calcFormData,
                  name: "th_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.th)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Heat of vaporization (DHv)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "J/kg", value: "J/kg" },
                    { name: "kJ/kg", value: "kJ/kg" },
                    { name: "Btu/lb", value: "Btu/lb" },
                    { name: "kcal/kg", value: "kcal/kg" },
                  ],
                  data: calcFormData,
                  name: "hv_new_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "hv",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Insulation conductivity (l)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "W/m.K", value: "W/m.K" },
                    { name: "cm3", value: "cm3" },
                    { name: "l", value: "l" },
                    { name: "dm3", value: "dm3" },
                    { name: "gal", value: "gal" },
                    { name: "ft3", value: "ft3" },
                  ],
                  data: calcFormData,
                  name: "ic_new_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.ic)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Insulation thickness (e)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "m", value: "m" },
                    { name: "mm", value: "mm" },
                    { name: "inch", value: "inch" },
                    { name: "ft", value: "ft" },
                  ],
                  data: calcFormData,
                  name: "it_new_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.it)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Discharge temperature
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "C", value: "C" },
                    { name: "K", value: "K" },
                    { name: "F", value: "F" },
                    { name: "R", value: "R" },
                  ],
                  data: calcFormData,
                  name: "dt_new_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.dt)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Environmental factor (F)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.ef)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Discharge mass flow (W)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {Combox({
                  options: [
                    { name: "kg/h", value: "kg/h" },
                    { name: "kg/s", value: "kg/s" },
                    { name: "lb/h", value: "lb/h" },
                    { name: "t/h", value: "t/h" },
                  ],
                  data: calcFormData,
                  name: "dflow1_unit",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.dflow1)}
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container direction="column" style={{padding:"0px 10px"}}>
              {CheckedBox({
                data: calcFormData,
                name: "ck_uda1",
                setFunc: setCalcFormData,
                label: "User defined area",
              })}
              {CheckedBox({
                data: calcFormData,
                name: "ck_tae",
                setFunc: setCalcFormData,
                label:
                  "There is a rapid evacuation AND prompt firefighting efforts",
              })}

              <div style={{marginTop:"60px",width:'100%',textAlign:'left'}}>
              <RadioGroups
              label="Environmental factor"
              data={calcFormData}
              name={"ef_opt"}
              options={[
                { label: "There is a fireproof insulation", value: 1 },
                { label: "Mounded tank", value: 2 },
                { label: "Other cases", value: 3 },
              ]}
              setFunc={setCalcFormData}
            />
              </div>
            
          </Grid>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={12}>
          <div className="fl f-a-c h-30">
          2. Vessel filled with gas or vapor:
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Exposed area (A)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.wa_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.ea)}
              </div>
            </Grid>
          </Grid>


          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Molecular weight (Mw)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                options: [
                  { name: "kg/kmol", value: "kg/kmol" },
                  { name: "lb/lbmol", value: "lb/lbmol" },
                ],
                data: calcFormData,
                name: "mw_unit",
                setFunc: setCalcFormData,
                
              })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "mw",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>


          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Relieving pressure (P0)</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                options: [
                  { name: "bar", value: "bar" },
                  { name: "psi", value: "psi" },
                  { name: "Pa", value: "Pa" },
                  { name: "bara", value: "bara" },
                  { name: "psia", value: "psia" },
                ],
                data: calcFormData,
                name: "rp_new_unit",
                setFunc: setCalcFormData,
              })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: calcFormData,
                  name: "rp",
                  setFunc: setCalcFormData,
                })}
              </div>
            </Grid>
          </Grid>



          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                Maximum wall temperature (Tw)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.dt_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.tw)}
              </div>
            </Grid>
          </Grid>



          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Discharge temperature (Tdisch)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData.dt_new_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {toFixed(calcFormData.tdisch)}
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Discharge mass flow (W)
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {calcFormData.dflow1_unit}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {toFixed(calcFormData.dflow2)}
              </div>
            </Grid>
          </Grid>
          
        </Grid>

        <Grid item xs={4}>
          <Grid container direction="column" style={{padding:"0px 10px"}}>
              {CheckedBox({
                data: calcFormData,
                name: "ck_uda2",
                setFunc: setCalcFormData,
                label: "User defined area",
              })}
          </Grid>
        </Grid>
      </Grid>


    </Grid>
  );
}
