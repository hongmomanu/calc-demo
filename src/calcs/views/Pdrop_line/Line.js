import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { RadioGroups } from "../../../components/RadioGroup";
import { httpPost } from "../../../http";
import { debounce, toFixedTip } from "../../../utils";
import liquid from "./liquid.png";
import noliquid from "./noliquid.png"

export default function ConeCoils() {
  const [commonFormData, setCommonFormData] = useState({
    massflow: 8496,
    mw: 74,
    cpcv: 1.14,
    mug: 0.7,
    liquid: 0,
  });
  return (
    <>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">Line pressure drop</div>
      </Grid>
      <Common {...{ commonFormData, setCommonFormData }} />
      <Down {...{ commonFormData }} />
      <Up {...{ commonFormData }} />
    </>
  );
}
function Common({ commonFormData, setCommonFormData }) {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Mass flow</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">kg/h</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: commonFormData,
                name: "massflow",
                setFunc: setCommonFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Molecular weight</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">kg/kmol</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: commonFormData,
                disabled: commonFormData.liquid == 1,
                name: "mw",
                setFunc: setCommonFormData,
              })}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">k (Cp/Cv)</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: commonFormData,
                disabled: commonFormData.liquid == 1,
                name: "cpcv",
                setFunc: setCommonFormData,
              })}
            </div>
          </Grid>

          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">Viscosity</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">cP</div>
          </Grid>
          <Grid item xs={4}>
            <div className="fl f-a-c f-j-c h-30 b-1-gray">
              {NumberInput({
                data: commonFormData,
                name: "mug",
                setFunc: setCommonFormData,
              })}
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <RadioGroups
          label="Fluid state"
          row={true}
          data={commonFormData}
          name={"liquid"}
          options={[
            { label: "Liquid", value: 1 },
            { label: "Gas", value: 0 },
          ]}
          setFunc={setCommonFormData}
        />
        <img src={commonFormData.liquid==1?liquid:noliquid} width={'100%'} />
      </Grid>
     
    </Grid>
  );
}
function ShowDialog({ open, setOpen, setCalcFormData, calcFormData }) {
  const [paramForm, setParamForm] = useState({
    elements: [
      { name: "elem#1", value: 0 },
      { name: "elem#2", value: 1 },
      { name: "elem#3", value: 2 },
      { name: "elem#4", value: 3 },
      { name: "elem#5", value: 4 },
      { name: "elem#6", value: 5 },
      { name: "elem#7", value: 6 },
      { name: "elem#8", value: 7 },
      { name: "elem#9", value: 8 },
      { name: "elem#10", value: 9 },
    ],
    currentelement: 0,
    diameters: [],
    currentdiam: 1,
    currentisch: 1,
  });
  useEffect(() => {
    httpPost({
      url: "/api/line/line/selectStandard",
      params: {},
      nofilter: true,
    }).then((rep) => {
      setParamForm((data)=>{
        const str = calcFormData.lineTables[data.currentelement]['dn']
        const currentdiam = rep.diameters.find((it)=>it.idiamName == str)?.idiam
        return { ...data, ...rep, currentdiam }
        });

    });
  }, []);
  useEffect(()=>{
    httpPost({
        url: "/api/line/line/select_pipe",
        params: {idiam:paramForm.currentdiam,isch:paramForm.currentisch},
        nofilter: true,
      }).then((rep) => {
        console.log('rep,rep',rep)
        setParamForm((data)=>{
            return {...data,...rep}
        });
      });
  },[paramForm.currentdiam,paramForm.currentisch])
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Standard diameter selection for Element</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="standard">
          <DialogContentText>choose element </DialogContentText>
          <Combox
            options={paramForm.elements}
            data={paramForm}
            name={"currentelement"}
            setFunc={setParamForm}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <DialogContentText>Pipe diameter </DialogContentText>
              <Combox
                options={paramForm.diameters.map((it) => {
                  return { name: it.idiamName, value: it.idiam };
                })}
                data={paramForm}
                name={"currentdiam"}
                setFunc={setParamForm}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="standard">
              <DialogContentText>Pipe Schedule </DialogContentText>
              <Combox
                options={paramForm.diameters
                  .find((it) => it.idiam)
                  ?.schedules?.map((it) => {
                    return { name: it.ischName, value: it.isch };
                  })}
                data={paramForm}
                name={"currentisch"}
                setFunc={setParamForm}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            inch
          </Grid>
          <Grid item xs={4}>
            mm
          </Grid>

          <Grid item xs={4}>
            External diameter
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.inchExternalDiameter)}
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.mmExternalDiameter)}
          </Grid>

          <Grid item xs={4}>
            Thickness
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.inchThickness)}
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.mmThickness)}
          </Grid>

          <Grid item xs={4}>
            Internal Diameter
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.inchInternalDiameter)}
          </Grid>
          <Grid item xs={4}>
            {toFixedTip(paramForm.mmInternalDiameter)}
          </Grid>
        </Grid>

    

        
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            setCalcFormData((data)=>{
                const lineTables = [...data.lineTables]
                if(!lineTables[paramForm.currentelement]){
                    lineTables[paramForm.currentelement] = {
                        l: 2.5,
                        ld: null,
                        k: 0.52,
                        rug: 0.015,
                        schedule:'STD'
                    }
                }
                lineTables[paramForm.currentelement]['dint'] = paramForm.mmInternalDiameter
                lineTables[paramForm.currentelement]['dn'] = paramForm.diameters.find((it)=>it.idiam==paramForm.currentdiam)?.idiamName
                return {...data,lineTables}
            })
          }}
        >
          Ok
        </Button>
        <Button onClick={() => {
            setOpen(false)
            

        }}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
function calcApi({ setCalcFormData, calcFormData, params, url }) {
  params.liquid = !!(params.liquid == 1);
  httpPost({
    url,
    params,
    nofilter: true,
  }).then((rep) => {
    rep.lineTablesOut = rep.lineTables;
    delete rep["lineTables"];
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi = debounce(calcApi);
const debCalcApiUp = debounce(calcApi);

function Down({ commonFormData }) {
  const [calcFormData, setCalcFormData] = useState({
    t: 191,
    /**
     * Temperature
     * liquid = false必填
     */
    zcompr: 0.817,
    /**
     * Compressibility factor (z)
     * liquid = false必填
     */
    pout: 0,
    /**
     * P downstream
     */
    dh: 0.001,
    /**
     * Elevation (Hd-Hu)
     * liquid = true必填
     */

    /**
     * Fluid state
     * Liquid = true;Gas = false
     */
    rhoout: 2.37815777030896,
    /**
     * Density downstream
     * liquid = true必填
     */
    usonic: null,
    pu: null,
    lineTablesOut: [],
    lineTables: [
      {
        dint: 77.9272,
        l: 0.5,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD',
      },
      {
        dint: 77.9272,
        l: 4,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD'
      },
      {
        dint: 77.9272,
        l: 2.5,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD'
      },
      {
        dint: 77.9272,
        l: 4,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD'
      }
    ],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    debCalcApi({
      calcFormData,
      setCalcFormData,
      params: { ...calcFormData, ...commonFormData },
      url: "/api/line/line/calc_down",
    });
  }, [
    calcFormData.t,
    calcFormData.zcompr,
    calcFormData.pout,
    calcFormData.dh,
    calcFormData.rhoout,
    calcFormData.lineTables,
    commonFormData.massflow,
    commonFormData.mw,
    commonFormData.cpcv,
    commonFormData.mug,
    commonFormData.liquid,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">Downstream to upstream</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Temperature</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">°C</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
            disabled: commonFormData.liquid == 1,
            data: calcFormData,
            name: "t",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Compressibility factor (z)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
            disabled: commonFormData.liquid == 1,
            data: calcFormData,
            name: "zcompr",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">P downstream</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">barg</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
            data: calcFormData,
            name: "pout",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Elevation (Hd-Hu)</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">m</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {commonFormData.liquid == 1 &&
            NumberInput({
              data: calcFormData,
              name: "dh",
              setFunc: setCalcFormData,
            })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Density downstream</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">kg/m3</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {commonFormData.liquid == 1
            ? toFixedTip(calcFormData.rhoout)
            : NumberInput({
                data: calcFormData,
                name: "rhoout",
                setFunc: setCalcFormData,
              })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Sonic velocity</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">m/s</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.usonic}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">P Upstream</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">barg</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.pu)}
        </div>
      </Grid>

      <Grid container>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Name</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            DN
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Schedule
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            D int
            <br />
            mm
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Length
            <br />m
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fittings L/D
            <br />m
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            K<br />m
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Rugosity
            <br />
            mm
          </div>
        </Grid>
      </Grid>

      <Grid item xs={12} margin={"10px"} textAlign="left">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          variant="contained"
        >
          Select standard diam
        </Button>
        <ShowDialog {...{ open, setOpen, setCalcFormData, calcFormData }} />
      </Grid>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((itp, idx) => {
        return (
          <Grid onClick={() => console.log("121212")} container>
            
            {["elem", "dn", "schedule","dint", "l", "ld", "k", "rug"].map((it, ix) => {
              return (
                <Grid item xs={1.5}>
                  <div className="fl f-a-c f-j-c h-30 b-1-gray">
                    {ix<3?<TextField
                      fullWidth={true}
                      style={{ textAlign: "center" }}
                      onChange={(e) => {
                        const val = e.target.value
                        setCalcFormData((data)=>{
                            const lineTables = [...data.lineTables];
                            const currentItem = lineTables[idx]
                            currentItem[it]=val
                            return {...data,lineTables}
                        })
                      }}
                      value={calcFormData.lineTables?.[idx]?.[it]||(ix===0?`${it}#${itp}`:'')}
                      variant="standard"
                    />:NumberInput({
                      data: calcFormData.lineTables[idx],
                      name: it,
                      setFunc: (data) => {
                        const lineTables = [...calcFormData.lineTables];
                        console.log("data", data);
                        lineTables[idx] = { ...data };
                        setCalcFormData({ ...calcFormData, lineTables });
                      },
                    })}
                  </div>
                </Grid>
              );
            })}
          </Grid>
        );
      })}

      <Grid item xs={12}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid>

      <Grid container>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            u in
            <br />
            m/s
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            u out
            <br />
            m/s
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Mach #<br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Re
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Frict fact
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Ltot
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Pin
            <br />
            barg
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Pout
            <br />
            barg
          </div>
        </Grid>
        <Grid item xs={1.6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            DP
            <br />
            bar
          </div>
        </Grid>
      </Grid>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((it, idx) => {
        return (
          <Grid container>
            {[
              "uin",
              "uout",
              "match",
              "re",
              "frict",
              "ltot",
              "pin",
              "pout",
              "dp",
            ].map((it, ix) => {
              return (
                <Grid item xs={ix < 8 ? 1.3 : 1.6}>
                  <div className="fl f-a-c f-j-c h-30 b-1-gray">
                    {toFixedTip(
                      calcFormData.lineTablesOut[idx]
                        ? calcFormData.lineTablesOut[idx][it]
                        : ""
                    )}
                  </div>
                </Grid>
              );
            })}
          </Grid>
        );
      })}
    </Grid>
  );
}
function Up({ commonFormData }) {
  const [calcFormData, setCalcFormData] = useState({
    t: 191,
    /**
     * Temperature
     * liquid = false必填
     */
    zcompr: 0.817,
    /**
     * Compressibility factor (z)
     * liquid = false必填
     */
    pout: 7.05,
    /**
     * P downstream
     */
    dh: 0.001,
    /**
     * Elevation (Hd-Hu)
     * liquid = true必填
     */

    /**
     * Fluid state
     * Liquid = true;Gas = false
     */
    rhoout: 2.37815777030896,
    /**
     * Density downstream
     * liquid = true必填
     */
    usonic: null,
    pu: null,
    lineTablesOut: [],
    lineTables: [
      {
        dint: 77.9272,
        l: 0.5,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD',
      },
      {
        dint: 77.9272,
        l: 4,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD',
      },
      {
        dint: 77.9272,
        l: 2.5,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD',
      },
      {
        dint: 77.9272,
        l: 4,
        ld: null,
        k: 0.52,
        rug: 0.015,
        dn:'NPS 3 - DN 80',
        schedule:'STD',
      },
    ],
  });

  const [open,setOpen] = useState(false)

  useEffect(() => {
    debCalcApiUp({
      calcFormData,
      setCalcFormData,
      params: { ...calcFormData, ...commonFormData },
      url: "/api/line/line/calc_up",
    });
  }, [
    calcFormData.t,
    calcFormData.zcompr,
    calcFormData.pout,
    calcFormData.dh,
    calcFormData.rhoout,
    calcFormData.lineTables,
    commonFormData.massflow,
    commonFormData.mw,
    commonFormData.cpcv,
    commonFormData.mug,
    commonFormData.liquid,
  ]);
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">Upstream to downstream</div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Temperature</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">°C</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
            disabled: commonFormData.liquid == 1,
            data: calcFormData,
            name: "t",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Compressibility factor (z)
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
            disabled: commonFormData.liquid == 1,
            data: calcFormData,
            name: "zcompr",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">P downstream</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">barg</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {NumberInput({
            data: calcFormData,
            name: "pout",
            setFunc: setCalcFormData,
          })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Elevation (Hd-Hu)</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">m</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {commonFormData.liquid == 1 &&
            NumberInput({
              data: calcFormData,
              name: "dh",
              setFunc: setCalcFormData,
            })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Density downstream</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">kg/m3</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {commonFormData.liquid == 1
            ? toFixedTip(calcFormData.rhoout)
            : NumberInput({
                data: calcFormData,
                name: "rhoout",
                setFunc: setCalcFormData,
              })}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">Sonic velocity</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">m/s</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {calcFormData.usonic}
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">P Upstream</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">barg</div>
      </Grid>
      <Grid item xs={4}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixedTip(calcFormData.pu)}
        </div>
      </Grid>

      <Grid container>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">Name</div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            DN
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Schedule
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            D int
            <br />
            mm
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Length
            <br />m
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Fittings L/D
            <br />m
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            K<br />m
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Rugosity
            <br />
            mm
          </div>
        </Grid>
      </Grid>

      {/* <Grid item xs={12}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid> */}
      <Grid item xs={12} margin={"10px"} textAlign="left">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          variant="contained"
        >
          Select standard diam
        </Button>
        <ShowDialog {...{ open, setOpen, setCalcFormData, calcFormData }} />
      </Grid>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((itp, idx) => {
        return (
          <Grid container>
            {["elem", "dn", "schedule","dint", "l", "ld", "k", "rug"].map((it, ix) => {
              return (
                <Grid item xs={1.5}>
                  <div className="fl f-a-c f-j-c h-30 b-1-gray">
                    {ix<3?<TextField
                      fullWidth={true}
                      style={{ textAlign: "center" }}
                      onChange={(e) => {
                        const val = e.target.value
                        setCalcFormData((data)=>{
                            const lineTables = [...data.lineTables];
                            const currentItem = lineTables[idx]
                            currentItem[it]=val
                            return {...data,lineTables}
                        })
                      }}
                      value={calcFormData.lineTables?.[idx]?.[it]||(ix===0?`${it}#${itp}`:'')}
                      variant="standard"
                    />:NumberInput({
                      data: calcFormData.lineTables[idx],
                      name: it,
                      setFunc: (data) => {
                        const lineTables = [...calcFormData.lineTables];
                        console.log("data", data);
                        lineTables[idx] = { ...data };
                        setCalcFormData({ ...calcFormData, lineTables });
                      },
                    })}
                  </div>
                </Grid>
              );
            })}
          </Grid>
        );
      })}

      <Grid item xs={12}>
        <div className="fl f-a-c f-j-c h-30"></div>
      </Grid>

      <Grid container>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            u in
            <br />
            m/s
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            u out
            <br />
            m/s
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Mach #<br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Re
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Frict fact
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Ltot
            <br />-
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Pin
            <br />
            barg
          </div>
        </Grid>
        <Grid item xs={1.3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            Pout
            <br />
            barg
          </div>
        </Grid>
        <Grid item xs={1.6}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            DP
            <br />
            bar
          </div>
        </Grid>
      </Grid>

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((it, idx) => {
        return (
          <Grid container>
            {[
              "uin",
              "uout",
              "match",
              "re",
              "frict",
              "ltot",
              "pin",
              "pout",
              "dp",
            ].map((it, ix) => {
              return (
                <Grid item xs={ix < 8 ? 1.3 : 1.6}>
                  <div className="fl f-a-c f-j-c h-30 b-1-gray">
                    {toFixedTip(
                      calcFormData.lineTablesOut[idx]
                        ? calcFormData.lineTablesOut[idx][it]
                        : ""
                    )}
                  </div>
                </Grid>
              );
            })}
          </Grid>
        );
      })}
    </Grid>
  );
}
