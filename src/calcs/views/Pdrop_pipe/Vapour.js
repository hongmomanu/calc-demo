import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import CalculateIcon from "@mui/icons-material/Calculate";
import { RadioGroups } from "../../../components/RadioGroup";
import { Charts } from "../../../components/Charts";
import { toFixed } from "../../../utils";
export default function Vapour() {
  const [calcFormData, setCalcFormData] = useState({
    temp_unit: "C",
    pres_unit: "bara",
    tin: 30,
    pin: 3,
    pout: 0.5,
    vp_dp: 2.5,
    rhoin: 14.065,
    cpcv: 1.35,
    dpipe: 303,
    length: 91000,
    fanning: 0.004455,
    k: 5.351881,
    vel: 169.7,
    specialType: 2,

    lsothTable:{
        vp_choked: "Choked",
        vp_massfl: 50.83109508821947,
        vp_massflcrit: 50.83109508821947,
        vp_pcrit: 1.0295444157598774,
        vp_tout: 30,
        vp_uin: 50.120407314242094,
        vp_uout: 146.0463673456467,
        vp_usonic_out: 169.69054455113414,
        vp_volflin: 3.6140131594894753,
        vp_volflout: 10.530909898108888,
    },

    lsothAppTable:{
        vp_choked: "Choked",
        vp_massfl: 58.76983303764195,
        vp_massflcrit: 58.76983303764195,
        vp_pcrit: 1.1903373970998206,
        vp_tout: 30,
        vp_uin: 57.948150920700435,
        vp_uout: 146.0463673456467,
        vp_usonic_out: 169.69054455113414,
        vp_volflin: 4.178445292402556,
        vp_volflout: 10.53090989810889,
    },
    adiabTable:{
        vp_choked: "Choked",
        vp_massfl: 52.231081683511,
        vp_massflcrit: 52.231081683511,
        vp_pcrit: 0.846703222193775,
        vp_tout: -118.3384797341198,
        vp_uin: 51.50082019475768,
        vp_uout: 157.8014897434969,
        vp_usonic_out: 157.8014897434969,
        vp_volflin: 3.713550066371205,
        vp_volflout: 11.378532040739962,
    },
    lsoths:[[],[],[],[],[]],
    lsothApps:[[],[],[],[],[]],
    adiabs:[[],[],[],[],[]],
    d_unit: "mm",
    l_unit: "mm",
    vel_unit: "m/s",
    dpres_unit: "bar",
    vp_massfl: "kg/s",
    volfl_unit: "m3/s",
    rho_unit: "kg/m3",
    massfl_unit: "kg/s",
  });

  const [isCalcing, setIsCalcing] = useState(false);

  useEffect(() => {
    httpPost({ url: "/api/pipe/vapour/v_pipe", params: calcFormData }).then((rep)=>{
        setCalcFormData({...calcFormData,...rep})
    });
  }, []);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">
          Models for vapour flow through a pipe
        </div>
      </Grid>

      <Grid item xs={12} container direction="row">
        <Grid item xs={8}>
          <TableOne
            calcFormData={calcFormData}
            setCalcFormData={setCalcFormData}
            isCalcing={isCalcing}
            setIsCalcing={setIsCalcing}
          />

          <TableTwo
            calcFormData={calcFormData}
            setCalcFormData={setCalcFormData}
            isCalcing={isCalcing}
            setIsCalcing={setIsCalcing}
          />

          <TableThree
            calcFormData={calcFormData}
            setCalcFormData={setCalcFormData}
            isCalcing={isCalcing}
            setIsCalcing={setIsCalcing}
          />
        </Grid>

        <Grid item xs={4}></Grid>
      </Grid>

      <Grid item xs={12} container direction="row">
      <Grid item xs={6}>
      <Charts xData={calcFormData.lsoths[0]} yDatas={[
          calcFormData.lsothApps[3],
          calcFormData.lsothApps[1],
          calcFormData.adiabs[1],
          calcFormData.lsoths[3],
          calcFormData.adiabs[3],
          calcFormData.lsoths[1],
      ]} columns={['unconstr','lsoth.app','adiabatic','unconstr-','unconstr','lsothermal']} />
      </Grid>
      <Grid item xs={6}>
      <Charts xData={calcFormData.lsoths[0]} yDatas={[
          calcFormData.lsothApps[4],
          calcFormData.lsoths[4],
          calcFormData.adiabs[4],
          calcFormData.adiabs[2],
          calcFormData.lsothApps[2],
          calcFormData.lsoths[2],
      ]} columns={['unconstr','unconstr','unconstr','adiabatic','lsoth.app','lsothermal']} />

      </Grid>
        
      </Grid>
    </Grid>
  );
}



function CalcPanel({ calcFormData, setCalcFormData, isCalcing, setIsCalcing }) {
  return (
    <Grid container direction="column">
      <Grid item xs={4}>
        <LoadingButton
          loading={isCalcing}
          loadingPosition="start"
          startIcon={<CalculateIcon />}
          size="large"
          style={{ width: "150px", marginTop: "30px" }}
          onClick={() => {
            httpPost({ url: "/api/pipe/vapour/v_pipe", params: calcFormData }).then((rep)=>{
                setCalcFormData({...calcFormData,...rep})
            });
          }}
          variant="contained"
        >
          计算
        </LoadingButton>
      </Grid>
      <Grid item xs={8} style={{ marginTop: "36px" }}>
        <RadioGroups
          label="Options"
          data={calcFormData}
          name={"specialType"}
          options={[
            { label: "L.special", value: 1 },
            { label: "K.special", value: 2 },
          ]}
          setFunc={setCalcFormData}
        />
      </Grid>
    </Grid>
  );
}

function TableOne({ calcFormData, setCalcFormData, isCalcing, setIsCalcing }) {
  return (
    <Grid container direction="row">
      <Grid item xs={9}>
        <Grid container direction="row">
          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Temperature in</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                options: [
                  { name: "°C", value: "C" },
                  { name: "K", value: "K" },
                  { name: "°F", value: "F" },
                  { name: "R", value: "R" },
                ],
                data: calcFormData,
                name: "temp_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "tin",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Pressure in</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                options: [
                  { name: "bar", value: "bar" },
                  { name: "psi", value: "psi" },
                  { name: "bara", value: "bara" },
                  { name: "psia", value: "psia" },
                  { name: "psig", value: "psig" },
                  { name: "barg", value: "barg" },
                ],
                data: calcFormData,
                name: "pres_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "pin",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Pressure out</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {calcFormData["pres_unit"]}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "pout",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Pressure drop</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {Combox({
                options: [
                  { name: "bar", value: "bar" },
                  { name: "psi", value: "psi" },
                  { name: "bara", value: "bara" },
                  { name: "psia", value: "psia" },
                ],
                data: calcFormData,
                name: "dpres_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "vp_dp",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Density in</div>
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
                name: "rho_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "rhoin",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              cp/cv (g) mean value
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "cpcv",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">D internal pipe</div>
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
                name: "d_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "dpipe",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Pipe length (L)</div>
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
                name: "l_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "length",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Fanning friction factor
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "fanning",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Velocity head (K)
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "k",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              Sonic velocity in
            </div>
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
                name: "vel_unit",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: calcFormData,
                name: "vel",
                setFunc: setCalcFormData,
              })}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <CalcPanel
          calcFormData={calcFormData}
          setCalcFormData={setCalcFormData}
          isCalcing={isCalcing}
          setIsCalcing={setIsCalcing}
        ></CalcPanel>
      </Grid>
    </Grid>
  );
}

function TableTwo({ calcFormData, setCalcFormData, isCalcing, setIsCalcing }) {
  return (
    <Grid container direction="row" style={{ marginTop: "6px" }}>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30">Isoth</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 ">Isoth. app</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30">Adiab</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Velocity in</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.vel_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_uin)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_uin)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_uin)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Velocity out</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.vel_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_uout)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_uout)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_uout)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Temperature out</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.temp_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_tout)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_tout)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_tout)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Sonic velocity out</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.vel_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_usonic_out)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_usonic_out)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_usonic_out)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Flow</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "kg/h", value: "kg/h" },
              { name: "kg/s", value: "kg/s" },
              { name: "lb/h", value: "lb/h" },
              { name: "t/h", value: "t/h" },
            ],
            data: calcFormData,
            name: "massfl_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_massfl)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_massfl)}</div>
      </Grid>

      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_massfl)}</div>
      </Grid>
    </Grid>
  );
}

function TableThree({
  calcFormData,
  setCalcFormData,
  isCalcing,
  setIsCalcing,
}) {
  return (
    <Grid container direction="row" style={{ marginTop: "6px" }}>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30">{calcFormData.lsothTable.vp_choked}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 ">{calcFormData.lsothAppTable.vp_choked}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30">{calcFormData.adiabTable.vp_choked}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Critical pressure </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.pres_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_pcrit)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_pcrit)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_pcrit)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Critical flow</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.massfl_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_massflcrit)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_massflcrit)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_massflcrit)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Volume flow in</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {Combox({
            options: [
              { name: "m3/h", value: "m3/h" },
              { name: "m3/s", value: "m3/s" },
              { name: "gal/h", value: "gal/h" },
              { name: "gpm", value: "gpm" },
            ],
            data: calcFormData,
            name: "volfl_unit",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_volflin)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_volflin)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_volflin)}</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Volume flow out</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.volfl_unit}
        </div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothTable.vp_volflout)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.lsothAppTable.vp_volflout)}</div>
      </Grid>
      <Grid item xs={2}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.adiabTable.vp_volflout)}</div>
      </Grid>
    </Grid>
  );
}
