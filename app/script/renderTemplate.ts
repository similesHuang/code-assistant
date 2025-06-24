const renderTemplate = (markdownText: string): string => {
  try {
    // 提取主要组件代码
    const componentMatch = markdownText.match(/```(?:jsx?|tsx?|react)?\s*([\s\S]*?)```/);
    if (!componentMatch) {
      console.warn("No component code found");
      return "";
    }
    let componentCode = componentMatch[1].trim();

    // 提取 mock 数据代码块
    const mockMatch = markdownText.match(/```(?:js|javascript)\s*(?:\/\/\s*filepath:.*mock\.js)?\s*export\s+default\s+([\s\S]*?)```/);
    let mockData = null;
    if (mockMatch) {
      // 去掉结尾多余分号和大括号
      mockData = mockMatch[1].trim();
      // 去掉末尾分号
      if (mockData.endsWith(";")) mockData = mockData.slice(0, -1);
      // 去掉末尾多余大括号
      if (mockData.endsWith("}")) {
        // 检查是否为对象字面量
        const openIdx = mockData.indexOf("{");
        if (openIdx !== -1 && mockData.slice(openIdx).split("{").length === mockData.slice(openIdx).split("}").length) {
          // 大致判断括号配对，保留
        } else {
          mockData = mockData.slice(0, -1);
        }
      }
    }
    // 将动态导入替换为内联数据
    if (mockData) {
      componentCode = componentCode.replace(
        /const res = await import\(['"]\.\/mock\/mock\.js['"]\);?/,
        `// 内联的 mock 数据\n      const res = { default: ${mockData} };`
      );
    }

    // 处理 export default function/class/变量/表达式
    let renderCall = "";
    let match = componentCode.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
    if (match) {
      const name = match[1];
      componentCode = componentCode.replace(/export\s+default\s+function\s+/, "function ");
      renderCall = `\nrender(<${name} />);`;
    }
    else if ((match = componentCode.match(/export\s+default\s+class\s+([A-Za-z0-9_]+)/))) {
      const name = match[1];
      componentCode = componentCode.replace(/export\s+default\s+class\s+/, "class ");
      renderCall = `\nrender(<${name} />);`;
    }
    else if ((match = componentCode.match(/export\s+default\s+([A-Za-z0-9_]+);?/))) {
      const name = match[1];
      componentCode = componentCode.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, "");
      renderCall = `\nrender(<${name} />);`;
    }
    else if (componentCode.match(/export\s+default\s+\(/) || componentCode.match(/export\s+default\s+function\s*\(/)) {
      componentCode = componentCode.replace(/export\s+default\s+/, "");
      renderCall = `\nrender(<Component />);`;
      componentCode = `const Component = ${componentCode}`;
    }
    else if ((match = componentCode.match(/const\s+([A-Za-z0-9_]+)\s*=\s*(\(?.*?\)?\s*=>|\s*function)/))) {
      const name = match[1];
      renderCall = `\nrender(<${name} />);`;
    } else {
      renderCall = `\nrender(<div>未能识别组件，请检查代码</div>);`;
    }

    // 移除所有 import 语句
    componentCode = componentCode.replace(/^import\s+.*?;?\s*$/gm, "");

    // 合成最终代码
    const finalCode = `${componentCode.trim()}\n${renderCall}`;
    return finalCode;
  } catch (error) {
    console.error("Error parsing template code:", error);
    return "";
  }
};

export default renderTemplate;