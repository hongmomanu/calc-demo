import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";
function calcApi({ setCalcFormData, calcFormData, vh_old_unit, vd_old_unit,
    ld_old_unit, lv_old_unit,it_old_unit,hv_old_unit,
    th_old_unit,wa_old_unit }) {
  if (vh_old_unit) calcFormData.vh_old_unit = vh_old_unit;
  if (vd_old_unit) calcFormData.vd_old_unit = vd_old_unit;
  if (ld_old_unit) calcFormData.ld_old_unit = ld_old_unit;
  if (lv_old_unit) calcFormData.lv_old_unit = lv_old_unit;
  if (it_old_unit) calcFormData.it_old_unit = it_old_unit;
  if (hv_old_unit) calcFormData.hv_old_unit = hv_old_unit;
  if (th_old_unit) calcFormData.th_old_unit = th_old_unit;
  if (wa_old_unit) calcFormData.wa_old_unit = wa_old_unit;
  httpPost({ url: "/api/fire/valveflow", params: calcFormData }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);

export default function Fire() {
  const [calcFormData, setCalcFormData] = useState({
    vh: 1.0,
    vh_new_unit: "m",
    vh_old_unit: "m",
    diam: 1.0,
    vd: 2.931,
    vd_new_unit: "kg/m3",
    vd_old_unit: "kg/m3",
    ld: 911.611,
    ld_new_unit: "kg/m3",
    ld_old_unit: "kg/m3",

    lv: 0.19,
    lv_new_unit: "mPa.s",
    lv_old_unit: "mPa.s",

    it: 0.97,
    it_new_unit: "mN/m",
    it_old_unit: "mN/m",

    brv_unit: "m/s",
    brv: 0.0869,
    fr: "Churn_turbul.",

    hv: 2133,
    hv_new_unit: "kJ/kg",
    hv_old_unit: "kJ/kg",

    th: 313.02976724405,
    th_new_unit: "kW",
    th_old_unit: "kW",

    wa: 11.1919238284136,
    wa_new_unit: "m2",
    wa_old_unit: "m2",

    dlhf: 16566,
    ls: 0.987,
  });
  const vh_old_unit = usePrevious(calcFormData.vh_new_unit);
  const vd_old_unit = usePrevious(calcFormData.vd_new_unit);
  const ld_old_unit = usePrevious(calcFormData.ld_new_unit);
  const lv_old_unit = usePrevious(calcFormData.lv_new_unit);
  const it_old_unit = usePrevious(calcFormData.it_new_unit);
  const hv_old_unit = usePrevious(calcFormData.hv_new_unit);
  const th_old_unit = usePrevious(calcFormData.th_new_unit);
  const wa_old_unit = usePrevious(calcFormData.wa_new_unit);
  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, vh_old_unit, vd_old_unit,
        ld_old_unit, lv_old_unit,it_old_unit,hv_old_unit,
        th_old_unit,wa_old_unit});
  }, [
    calcFormData.vh,
    calcFormData.diam,
    calcFormData.vh_new_unit,
    calcFormData.vd,
    calcFormData.vd_new_unit,
    calcFormData.ld,
    calcFormData.ld_new_unit,
    calcFormData.lv,
    calcFormData.lv_new_unit,
    calcFormData.it,
    calcFormData.it_new_unit,
    calcFormData.hv,
    calcFormData.hv_new_unit,
    calcFormData.th,
    calcFormData.th_new_unit,
    calcFormData.wa,
    calcFormData.wa_new_unit
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Critical filling ratio (Fire / vertical vessel)
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">Bubbles generated on a surface</div>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Vessel Height (Hl)</div>
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
              name: "vh_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "vh",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Vessel diameter (D)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vh_new_unit}
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

      <Grid container >
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Vapor density (rg)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "kg/m3", value: "kg/m3" },
                  { name: "kg/l", value: "kg/l" },
                  { name: "lb/gal", value: "lb/gal" },
                  { name: "lb/ft3", value: "lb/ft3" },
                ],
                data: calcFormData,
                name: "vd_new_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "vd",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Liquid density (rl)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "kg/m3", value: "kg/m3" },
                  { name: "kg/l", value: "kg/l" },
                  { name: "lb/gal", value: "lb/gal" },
                  { name: "lb/ft3", value: "lb/ft3" },
                ],
                data: calcFormData,
                name: "ld_new_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ld",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Liquid viscosity
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "mN.s/m2", value: "mN.s/m2" },
                  { name: "mPa.s", value: "mPa.s" },
                  { name: "cP", value: "cP" },
                  { name: "N.s/m2", value: "N.s/m2" },
                ],
                data: calcFormData,
                name: "lv_new_unit",
                setFunc: setCalcFormData,
              })}
          </div>

        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "lv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Interfacial tension (s)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "mN/m", value: "mN/m" },
                  { name: "N/m", value: "N/m" },
                  { name: "dyne/cm", value: "dyne/cm" },
                  { name: "lbf/ft", value: "lbf/ft" },
                ],
                data: calcFormData,
                name: "it_new_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "it",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Bubble rise velocity (Uinf)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
                options: [
                  { name: "m/s", value: "m/s" },
                  { name: "cm/s", value: "cm/s" },
                  { name: "ft/s", value: "ft/s" },
                ],
                data: calcFormData,
                name: "brv_unit",
                setFunc: setCalcFormData,
              })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.brv)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Flow regime</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.fr}
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
              name: "th_new_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "th",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Wetted area (A)
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
            {NumberInput({
              data: calcFormData,
              name: "wa",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>


      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Dimension less heat flux (q)
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          -
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.dlhf)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          f limit surface
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
          
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.ls)}
          </div>
        </Grid>
      </Grid>
    
    </Grid>
  );
}
