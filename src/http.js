import React, { useState } from "react";
import { render } from "react-dom";
import Alert from "@mui/material/Alert";
import { createPortal, unmountComponentAtNode } from "react-dom";
export function httpPost({ url, params }) {
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
        return data;
      } else if (code === 1) {
        return Promise.reject(msg);
      }
    })
    .catch((e) => {
      showAlert(e);
      return Promise.reject()
    });
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

window.httpPost = httpPost;
