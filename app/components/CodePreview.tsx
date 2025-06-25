import { LiveProvider, LivePreview } from "react-live";
import qs from "query-string";
import * as antd from "antd";
import * as infraUtils from '@bilibili/infra-utils';
// import {useLocation} from 'react-router-dom'
// import * as history from 'history'

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const mockLocation = {
  pathname: "/",
  search: "",
};
const useLocation = () => mockLocation;
const history = {
  replace: (v: any) => {
    // 可以在这里打印或忽略
    // console.log("history.replace", v);
  },
};

const umi = {
  history: history,
  useLocation: useLocation,
}

const CodePreview: React.FC<{ code: string }> = ({ code }) => {
  return (
    <LiveProvider
      code={code}
      noInline
       scope={{
        React,
        infraUtils,
        ...antd,
        qs,
        useState,
        useEffect,
        useMemo,
        useCallback,
        ...umi,
        render: (el: any) => el,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "calc(100vh - 100px)",
          overflowY: "auto",
          background: "#f5f6fa",
        }}
      >
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            background: "#fff",
            border: "1px solid #e5e7eb",
            overflow: "scroll",
          }}
        >
          {/* 浏览器头部 */}
          <div
            style={{
              height: 36,
              background: "#f3f4f6",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ff5f56",
                marginRight: 4,
              }}
            />
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ffbd2e",
                marginRight: 4,
              }}
            />
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#27c93f",
              }}
            />
            <span
              style={{
                flex: 1,
                textAlign: "center",
                color: "#999",
                fontSize: 12,
              }}
            >
              代码预览
            </span>
          </div>
          {/* 预览内容 */}
          <div style={{ padding: 24, minHeight: 200 }}>
            <LivePreview />
          </div>
        </div>
      </div>
    </LiveProvider>
  );
};
export default CodePreview;
