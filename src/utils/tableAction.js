import React from "react";
import { TableActionsBtns } from "../components/ActionsBtns";
import { Tag } from "antd";
import { tableTooltip } from "./utilfuns";

export const tableSizes = (length, height = undefined) => {
  const width = Math.max(length * 165, 330);
  const maxheight = height ? `calc(100vh - ${height}px)` : undefined;
  return { x: width, y: maxheight };
};

export const buildColumns = (
  menu,
  data = [],
  filterFields = {},
  deleteFun,
  customRenderMap = {},
  isActionNeed = true
) => {
  const {
    numberFields = [],
    selectFields = [],
    //dateFields = [],
    excludeFields = ["_id"],
  } = filterFields;
  const sampleRecord = data[0] || {};

  const columns = Object.keys(sampleRecord)
    .filter((key) => !excludeFields.includes(key))
    .map((key) => {
      const col = {
        title: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        dataIndex: key,
        key: key,
        render: (text) => {
          if (!text) return "";
          return tableTooltip(text);
        },
      };

      if (key === "status") {
        col.width = "5.5rem";
      }
      // Apply custom render logic if provided
      if (customRenderMap[key]) {
        col.render = customRenderMap[key];
      }

      // // ✅ Automatically render boolean values
      // else if (typeof sampleRecord[key] === "boolean") {
      //   col.render = (value) => String(value);
      // }

      // ✅ Automatically handle booleans
      else if (typeof sampleRecord[key] === "boolean") {
        col.render = (value) => (
          <Tag color={value ? "green" : "red"}>{value ? "True" : "False"}</Tag>
        );
      }

      if (selectFields.includes(key)) {
        col.filters = [...new Set(data.map((item) => item[key]))].map(
          (val) => ({
            text: typeof val === "boolean" ? (val ? "True" : "False") : val,
            value: val,
          })
        );
        col.onFilter = (value, record) => record[key] === value;
      }

      if (numberFields.includes(key)) {
        col.sorter = (a, b) => Number(a[key]) - Number(b[key]);
      }

      // if (dateFields.includes(key)) {
      //   col.sorter = (a, b) =>
      //     new Date(a[key].split("-").reverse().join("-")) -
      //     new Date(b[key].split("-").reverse().join("-"));
      // }

      return col;
    });

  if (isActionNeed) {
    columns.push({
      title: "Action",
      width: "6rem",
      key: "action",
      render: (_, record) => (
        <TableActionsBtns menu={menu} row={record} deleteFun={deleteFun} />
      ),
    });
  }

  return columns;
};

export const camelToTitle = (str) => {
  return str
    .replace(/([A-Z])/g, " $1") // insert space before capital letters
    .replace(/^./, (s) => s.toUpperCase()); // capitalize the first letter
};
