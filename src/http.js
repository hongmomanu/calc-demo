import React, { useState } from "react";
import { render } from "react-dom";
import Alert from "@mui/material/Alert";
import {  unmountComponentAtNode } from "react-dom";
import CircularIndeterminate from "./components/Loading";
export function httpPost({ url, params,nofilter=false }) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(params),
  })
    .then(function (response) {
      return response.json();
    })
    .then((response) => {
      const { code, data, msg } = response;
      if (code === 200) {
        return nofilter?data:filterRes(data,params);
      } else if (code === 1) {
        return Promise.reject(msg);
      }
    })
    .catch((e) => {
      showAlert(e);
      return Promise.reject()
    })

}
function filterRes(res,req={}){
  if(!req) return res
  for(let key in res){
    if(res[key] == req[key]){
      delete res [key]
    }
  }
  return res
}

function showAlert(msg) {
  if(typeof msg !== 'string'){
    msg = msg.toString()
  }  
  const Dom = document.createElement("div");
  Dom.style.position = "fixed";
  Dom.style.top = "50%";
  Dom.style.left = "50%";
  Dom.style.transform = "translateY(-50%) translateX(-50%)";

  document.body.appendChild(Dom);
  const close = () => {
    unmountComponentAtNode(Dom);
    document.body.removeChild(Dom);
  };
  setTimeout(() => {
    close();
  }, 5000);
  render(<Alert severity="error">{msg}</Alert>, Dom);
}

// const LoadingTool ={
//   loadingElm:null,
//   show:()=>{
//     LoadingTool.create()
//     render(<CircularIndeterminate/>, LoadingTool.loadingElm);
//   },
//   hide:()=>{
//     if(LoadingTool.loadingElm){
//       unmountComponentAtNode(LoadingTool.loadingElm);
//       document.body.removeChild(LoadingTool.loadingElm);
//       LoadingTool.loadingElm = null;
//     }
    
//   },
//   create:()=>{
//     if(!LoadingTool.loadingElm){
//       const Dom = document.createElement("div");
//       Dom.style.position = "fixed";
//       Dom.style.top = "50%";
//       Dom.style.left = "50%";
//       Dom.style.transform = "translateY(-50%) translateX(-50%)";
//       Dom.style.backgroundColor = "rgba(0,0,0,.3)";
//       document.body.appendChild(Dom);
//       LoadingTool.loadingElm = Dom
//     }
    

//   }
// }

window.httpPost = httpPost;
