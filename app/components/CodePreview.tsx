import { LiveProvider, LivePreview } from "react-live";

const CodePreview: React.FC<{ code: string }> = ({ code }) => {
  return (
    <LiveProvider code={code} noInline>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          
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
            overflow: "hidden",
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
            <span style={{ flex: 1, textAlign: "center", color: "#999", fontSize: 12 }}>
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