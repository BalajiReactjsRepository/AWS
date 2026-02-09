import { Tooltip } from "antd";

export const tableTooltip = (text, cutlentgth = 25) => {
  const isLong = text.length > cutlentgth;
  const displayText = isLong ? text.slice(0, cutlentgth) + "..." : text;

  return isLong ? (
    <Tooltip title={text}>
      <span>{displayText}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  );
};
