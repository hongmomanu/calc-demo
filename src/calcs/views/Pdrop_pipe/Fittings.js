import React, { useEffect, useState } from "react";
import { httpPost } from "../../../http";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Combox } from "../../../components/Combox";
import { NumberInput } from "../../../components/NumberInput";
import { LoadingButton } from "@mui/lab";
import usePrevious from "../../../hooks/use-previous";
import { debounce, toFixed } from "../../../utils";

function calcApi({
  setCalcFormData,
  calcFormData,
  unit_form,old_unit
}) {
  const new_data={...unit_form}
  if(old_unit){
    new_data.old_unit = old_unit
  }
  
  httpPost({
    url: "api/pipe/fitting/fitting_values",
    params: {...calcFormData,...new_data},
  }).then((rep) => {
    setCalcFormData({ ...calcFormData, ...rep });
  });
}
const debCalcApi1 = debounce(calcApi)
const debCalcApi2 = debounce(calcApi)
const debCalcApi3 = debounce(calcApi)
const debCalcApi4 = debounce(calcApi)

function LocalCalcResult(formData) {
  console.log("formData", formData);
  return (
    <Grid container>
      <Grid item xs={6}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          Sum (L/D*number or K*number)
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(formData[2]
            .map((it, ix) => {
              return it * formData[1][ix];
            })
            .reduce((a, b) => a + b)) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(formData[3]
            .map((it, ix) => {
              return it * formData[1][ix];
            })
            .reduce((a, b) => a + b)) }
        </div>
      </Grid>
      <Grid item xs={1.5}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(formData[4]
            .map((it, ix) => {
              return it * formData[1][ix];
            })
            .reduce((a, b) => a + b)) }
        </div>
      </Grid>
    </Grid>
  );
}

function LocalCalcFormTwo() {
  const [formData, setFormData] = useState([
    [
      0.14, 6.6, 3.6, 0.24, 0.1, 0.9, 1.54, 1.34, 1.8, 1.34, 0.4, 0.3, 0.52, 1,
      0.36, 0.3, 0.62, 0, 0, 0, 0,
    ],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  return (
    <>
      {formData[0].map((it, ix) => {
        return (
          <Grid key={ix} container>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {formData[0][ix]}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[1],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[1] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[2],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[2] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[3],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[3] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
          </Grid>
        );
      })}
      {LocalCalcResultTwo(formData)}
    </>
  );
}

function LocalCalcResultTwo(formData) {
  return (
    <Grid container>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray"></div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(
            formData[1]
              .map((it, ix) => {
                return it * formData[0][ix];
              })
              .reduce((a, b) => a + b)
          )}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(
            formData[2]
              .map((it, ix) => {
                return it * formData[0][ix];
              })
              .reduce((a, b) => a + b)
          )}
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className="fl f-a-c f-j-c h-30 b-1-gray">
          {toFixed(
            formData[3]
              .map((it, ix) => {
                return it * formData[0][ix];
              })
              .reduce((a, b) => a + b)
          )}
        </div>
      </Grid>
    </Grid>
  );
}

function LocalCalcForm() {
  const [formData, setFormData] = useState([
    [
      "Open slide (gate) valve",
      "Open globe valve",
      "Open angle valve",
      "Open butterfly valve",
      "Open ball valve",
      "Open plug valve",
      "Swing check valve",
      "T - side inlet - 2 outlets on the main tube",
      "T - side inlet - 1 outlet on the main tube",
      "T - 1 side outlet",
      "T - inlet and outlet on the main tube",
      "45° elbow middle radius of curvature",
      "90° elbow middle radius of curvature",
      "180° elbow middle radius of curvature",
      "Nozzle on a tank",
      "Sudden contraction",
      "Sudden widening",
      "Others …",
      "Others …",
      "Others …",
      "Others …",
    ],
    [
      7, 330, 180, 12, 5, 45, 77, 67, 90, 67, 20, 15, 26, 50, 18, 15, 31, 0, 0,
      0, 0,
    ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  return (
    <>
      {formData[0].map((it, ix) => {
        return (
          <Grid key={ix} container>
            <Grid item xs={6}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">{it}</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {formData[1][ix]}
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[2],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[2] = Object.values(val);
                    console.log("val",val)
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[3],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[3] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">
                {NumberInput({
                  data: formData[4],
                  name: ix,
                  setFunc: (val) => {
                    const data = [...formData];
                    data[4] = Object.values(val);
                    setFormData(data);
                  },
                })}
              </div>
            </Grid>
          </Grid>
        );
      })}
      {LocalCalcResult(formData)}
    </>
  );
}

function LocalCalc() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <div className="fl  f-a-c h-30">Fittings and valves</div>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={1.5}></Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#1</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#1</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#3</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">L/D</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={1.5}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
          </Grid>
          <LocalCalcForm />
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#1</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#2</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">Case#3</div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fl f-a-c f-j-c h-30 b-1-gray">number</div>
            </Grid>
          </Grid>
          <LocalCalcFormTwo />
        </Grid>
      </Grid>
    </Grid>
  );
}


export default function Fittings() {
  const [calcFormData, setCalcFormData] = useState({
    new_unit: "mm",
  });
  const old_unit = usePrevious(calcFormData.new_unit);
  

  return (
    <Grid container>
      <LocalCalc />
      {K1({unit_form:calcFormData,old_unit,setUnitForm:setCalcFormData})}
      {K2({unit_form:calcFormData,old_unit})}
      {K3({unit_form:calcFormData,old_unit})}
      {K4({unit_form:calcFormData,old_unit})}
      
    </Grid>
  );
}

function K1({unit_form,old_unit,setUnitForm}){
  
  const [calcFormData, setCalcFormData] = useState({
    ckv: 3100,
    d: 250,
    type: 1,
    k:.87
  });
  console.log("unit_form.new_unit",unit_form.new_unit)
  useEffect(()=>{
    debCalcApi1({calcFormData,setCalcFormData,unit_form,old_unit})
  },[unit_form.new_unit,calcFormData.ckv,calcFormData.d])
  return (<><Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from CV (US Units)</div>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">CV</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">gpm - 1 psi</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ckv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
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
              data: unit_form,
              name: "new_unit",
              setFunc: setUnitForm,
            })}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "d",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">-</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">{toFixed(calcFormData.k) }</div>
        </Grid>
      </Grid></>)
}
function K2({unit_form,old_unit}){
  const [calcFormData, setCalcFormData] = useState({
    ckv: 860,
    d: 250,
    type: 2,
    k:.83
  });
  useEffect(()=>{
    debCalcApi2({calcFormData,setCalcFormData,unit_form,old_unit})
  },[unit_form.new_unit,calcFormData.ckv,calcFormData.d])
  return (<>
    <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from CVm (Metric Units)</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">CVm</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h - 1 mH20</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ckv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {unit_form.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "d",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
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
      </Grid>
  </>)
}

function K3({unit_form,old_unit}){
  const [calcFormData, setCalcFormData] = useState({
    ckv: 2682,
    d: 250,
    type: 3,
    k:.87
  });
  useEffect(()=>{
    debCalcApi3({calcFormData,setCalcFormData,unit_form,old_unit})
  },[unit_form.new_unit,calcFormData.ckv,calcFormData.d])
  return (<>
    <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from KV</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">KV (flow factor)</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">m3/h - 1 bar</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ckv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {unit_form.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "d",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
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
      </Grid>
  </>)
}

function K4({unit_form,old_unit}){
  const [calcFormData, setCalcFormData] = useState({
    ckv: 44430,
    d: 250,
    type: 4,
    k:.88
  });
  useEffect(()=>{
    debCalcApi4({calcFormData,setCalcFormData,unit_form,old_unit})
  },[unit_form.new_unit,calcFormData.ckv,calcFormData.d])
  return (<>
    <Grid item xs={12}>
        <div className="fl  f-a-c h-30">K from KV (French)</div>
      </Grid>
      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">KV</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">l/min - 1 bar</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "ckv",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">D</div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {unit_form.new_unit}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">
            {NumberInput({
              data: calcFormData,
              name: "d",
              setFunc: setCalcFormData,
            })}
          </div>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={3}>
          <div className="fl f-a-c f-j-c h-30 b-1-gray">K</div>
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
      </Grid>
  </>)
}
