import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

import './App.css';
//demo 入口
function App() {
  const [tableVals, setTableVals] = useState({ a: 1, b: 2, c: 1,x:2 })
  const [areaPercent,setAreaPercent] = useState(30)
  return <div className="app">
      <div className="line fl f-d-r f-a-c">
          <ControlTable {...tableVals} setTableVals={setTableVals} />
          <Charts {...tableVals} />
          <Formula />
      </div>

      <div className="line fl f-d-r f-a-c">
        <div className="fl f-d-c f-a-c">
          <label>面积控制</label>
          <input style={{marginTop:'10px',marginRight:'20px'}} type="range" onChange={(e)=>{
            setAreaPercent(Number(e.target.value))
          }} min="1" max="100" value={areaPercent} />
        </div>
        
        <AreaChange areaPercent={areaPercent} />
      </div>

  </div>
}

//面积控制区域
function AreaChange({areaPercent=0}) {
  return <div className="progress-container">
          <div className="progress" style={{height:`${areaPercent}%`}}></div>
      </div>
}

//改变table输入值
function changeTableVal(val, setTableVals) {
  setTableVals((vals) => {
      return { ...vals, ...val }
  })
}
//表格控制
function ControlTable({ a, b, c, setTableVals,x }) {
  return <div className="control-table f-d-c fl">
      <div className="fl f-d-r">
          <div className="fl w-m-60 b-1-gray f-a-c h-30">参数a:</div>
          <input type="number"  className="fl table-value f-1 b-1-gray h-30 f-a-c" 
          onChange={(e) => changeTableVal({ a: e.target.value }, setTableVals)} 
          value={a} />
      </div>
      <div className="fl f-d-r">
          <div className="fl w-m-60 b-1-gray h-30 f-a-c">参数b:</div>
          <input type="number" className="fl table-value f-1 b-1-gray h-30 f-a-c"
          onChange={(e) => changeTableVal({ b: e.target.value }, setTableVals)} 
          value={b} />
      </div>
      <div className="fl f-d-r">
          <div className="fl w-m-60 b-1-gray h-30 f-a-c">参数c:</div>
          <input type="number" className="fl table-value f-1 b-1-gray h-30 f-a-c"
          onChange={(e) => changeTableVal({ c: e.target.value }, setTableVals)}
          value={c} />
      </div>
      <div className="fl f-d-r f-a-c f-j-c">
        <div className="fl w-m-60 b-1-gray h-30 f-a-c">x值为：</div><input style={{width:'30px'}} type="number" className="fl table-value f-1 b-1-gray h-30 f-a-c"
            onChange={(e) => changeTableVal({ x: e.target.value }, setTableVals)}
            value={x} />
        <span>y值为:{a*Math.pow(x,2)+b*x+c*1}</span>
        </div>
  </div>
}
//曲线
function Charts({ a, b, c }) {
  const x_arr = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5]
  const data = []
  x_arr.forEach((it)=>{
    const item  = {name:it,value:a*Math.pow(it,2)+b*it+c*1}
    data.push(item)
  })
  
  return <div className="charts fl f-1">
      <LineChart width={400} height={250} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
      </div>
}
//公式
function Formula(){
  return <div className="formula fl f-1 f-d-c">
    <div className="fl f-1 f-a-c f-j-c">{" \\(y = ax^2 + bx + c\\)  。当 \\(a \\ne 0\\) 时"}</div>
    <div className="fl f-1 f-a-c f-j-c" style={{marginTop:'50px'}}>{"\\[x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\\]"}</div>
    
  </div>
}
export default App;
