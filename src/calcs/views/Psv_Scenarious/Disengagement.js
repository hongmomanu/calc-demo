import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import CalculateIcon from "@mui/icons-material/Calculate";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";
import { TextField } from "@mui/material";
import { Charts } from "../../../components/Charts";
import { chartData } from "./data";

function calcApi({ setCalcFormData, calcFormData, setIsCalcing }) {
  setIsCalcing(true);
  httpPost({ url: "/api/disengagment/valveflow", params: calcFormData })
    .then((rep) => {
      rep.fre = rep.fr;
      delete rep["fr"];
      setCalcFormData({ ...calcFormData, ...rep });
    })
    .finally(() => {
      setIsCalcing(false);
    });
}
const debCalcApi = debounce(calcApi);

export default function Disengagement() {
  const [calcFormData, setCalcFormData] = useState({
    diam: 2.2,
    length_unit: "m",
    rhog: 4.921,
    rhog_unit: "kg/m3",
    rhof: 874,
    rhof_unit: "kg/m3",
    mul: 0.29,
    visc_unit: "cP",
    sigma: 10,
    sigma_unit: "mN/m",
    f: 2.92,
    flow_unit: "kg/s",
    fr: 0.93,
    vel_unit: "m/s",
  });

  const [isCalcing, setIsCalcing] = useState(false);

  useEffect(() => {
    debCalcApi({ setCalcFormData, calcFormData, setIsCalcing });
  }, [
    calcFormData.diam,
    calcFormData.length_unit,
    calcFormData.rhog,
    calcFormData.rhog_unit,
    calcFormData.rhof,
    calcFormData.rhof_unit,
    calcFormData.mul,
    calcFormData.visc_unit,
    calcFormData.sigma,
    calcFormData.sigma_unit,
    calcFormData.f,
    calcFormData.fr,
    calcFormData.vel_unit,
  ]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl f-a-c h-30">
          Two-phase vapor-liquid flow disengagement
        </div>
      </Grid>
      <Grid item xs={12}>
        {/* <LoadingButton
              loading={isCalcing}
              loadingPosition="start"
              startIcon={<CalculateIcon />}
              size="large"
              style={{ width: "150px", marginTop: "30px" }}
              onClick={() =>
                debCalcApi({
                  calcFormData,
                  setIsCalcing,
                  setCalcFormData
                })
              }
              variant="contained"
            >
              计算
            </LoadingButton> */}
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Vessel diameter</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m", value: "m" },
                { name: "mm", value: "mm" },
                { name: "inch", value: "inch" },
                { name: "ft", value: "ft" },
              ],
              data: calcFormData,
              name: "length_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
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
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Vapor density (rg)</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/m3", value: "kg/m3" },
                { name: "kg/l", value: "kg/l" },
                { name: "lb/gal", value: "lb/gal" },
                { name: "lb/ft3", value: "lb/ft3" },
              ],
              data: calcFormData,
              name: "rhog_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "rhog",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Liquid density (rl)
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/m3", value: "kg/m3" },
                { name: "kg/l", value: "kg/l" },
                { name: "lb/gal", value: "lb/gal" },
                { name: "lb/ft3", value: "lb/ft3" },
              ],
              data: calcFormData,
              name: "rhof_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "rhof",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Liquid viscosity</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "mN.s/m2", value: "mN.s/m2" },
                { name: "mPa.s", value: "mPa.s" },
                { name: "cP", value: "cP" },
                { name: "N.s/m2", value: "N.s/m2" },
              ],
              data: calcFormData,
              name: "visc_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "mul",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Interfacial tension (s)
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "mN/m", value: "mN/m" },
                { name: "N/m", value: "N/m" },
                { name: "dyne/cm", value: "dyne/cm" },
                { name: "lbf/ft", value: "lbf/ft" },
              ],
              data: calcFormData,
              name: "sigma_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "sigma",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Vent Flow</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "kg/h", value: "kg/h" },
                { name: "kg/s", value: "kg/s" },
                { name: "lb/h", value: "lb/h" },
                { name: "t/h", value: "t/h" },
              ],
              data: calcFormData,
              name: "flow_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "f",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Filling ratio (f)</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "fr",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Average void fraction (a)
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.alpha)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Superficial vapor velocity (jginf)
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {Combox({
              options: [
                { name: "m/s", value: "m/s" },
                { name: "cm/s", value: "cm/s" },
                { name: "ft/s", value: "ft/s" },
              ],
              data: calcFormData,
              name: "vel_unit",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.jginf)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Transition velocity (Utrans)
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vel_unit}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.ut)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Flow regime</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">{calcFormData.fre}</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c h-30"></div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30">Churn-turbulent</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30">Bubbly</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <div className="fl f-a-c h-30">
            Two phase flow onset/Disengagement
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Best estim.</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Conservat.</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Best estim.</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Conservat.</div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c h-30 b-1-gray">
            Bubble rise velocity (Uinf)
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vel_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.uinf1)}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.uinf2)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c h-30 b-1-gray">yF</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.psif1)}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.psif2)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c h-30 b-1-gray">y (start 2 phases flow)</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.psi1)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.psi2)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.psi3)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.psi4)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c h-30 b-1-gray">
            One or Two phase Vent Flow
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vapor_phase1}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vapor_phase2}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vapor_phase3}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {calcFormData.vapor_phase4}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c h-30 b-1-gray">
            Filling ratio at disengagement
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.phi_dis1)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.phi_dis2)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.phi_dis3)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.phi_dis4)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={4.5}>
          <div className="fl f-a-c h-30 b-1-gray">
            Void fraction at disengagement
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.alpha_dis1)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.alpha_dis2)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.alpha_dis3)}
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {toFixed(calcFormData.alpha_dis4)}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Charts
            scatters={["phi_dis1", "phi_dis2", "phi_dis3", "phi_dis4"]}
            scatters_data={[
              {
                name: calcFormData.phi_dis1,
                phi_dis1: calcFormData.psif1,
              },
              {
                name: calcFormData.phi_dis2,
                phi_dis2: calcFormData.psif1,
              },
              {
                name: calcFormData.phi_dis3,
                phi_dis3: calcFormData.psif2,
              },
              {
                name: calcFormData.phi_dis4,
                phi_dis4: calcFormData.psif2,
              },
            ]}
            layout="vertical"
            yReversed={true}
            xScale={"log"}
            xTicks={[
              0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7,
              8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
            ]}
            xTickFormatter={(val, ix) => {
              const filterArr = [0.1, 1, 10, 100];
              if (filterArr.includes(val)) return val;
              else return "";
            }}
            yTicks = {[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]}
            // xDomain={['dataMin', 'dataMax']}
            xDomain={["auto", "auto"]}
            xData={chartData[0]}
            yDatas={[chartData[1], chartData[2], chartData[3], chartData[4]]}
            yDomain={['auto','auto']}
            columns={[
              "CT, best estimate",
              "CT, conservative",
              "B, best estimate",
              "B,conservative or H",
            ]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
