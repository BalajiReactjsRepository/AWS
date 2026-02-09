import React from "react";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined, HistoryOutlined } from "@ant-design/icons";

import arrowIcon from "../../../images/AdminImages/arrow-small-left.png";
import crossIcon from "../../../images/AdminImages/cross-small.png";
import downloadIcon from "../../../images/AdminImages/downloadIcon.svg";

// Validation schema for Excel file upload
const validationSchema = Yup.object({
  file: Yup.mixed()
    .required("File is required")
    .test("fileType", "Only Excel files are allowed", (value) => {
      if (!value) return false;
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      return allowedTypes.includes(value.type);
    }),
});

const StationImportForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // console.log("Uploaded file:", values.file);
    // Submit logic here
  };

  const downloadSampleFile = () => {
    // logic to download sample Excel file
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button
          className="custom-button"
          style={{
            border: "2px solid #E4E4E4",
            color: "#1890ff",
            background: "transparent",
          }}
          icon={<img src={downloadIcon} alt="down" />}
          onClick={downloadSampleFile}
        >
          Download Sample File
        </Button>
        <Button
          className="custom-button"
          style={{
            background: "#F2F2F2",
            color: "#000",
            border: "none",
          }}
          icon={<HistoryOutlined />}
          onClick={() => navigate("history")}
        >
          History
        </Button>
      </div>

      <Formik
        initialValues={{ file: null }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          setFieldValue,
          validateForm,
          submitForm,
          resetForm,
          setTouched,
          values,
        }) => (
          <Form>
            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <label htmlFor="file">Select Excel File</label>
                <div
                  className="form-control"
                  style={{
                    position: "relative",
                    backgroundColor: "#0000000a",
                    border: "1px solid #00000057",
                  }}
                >
                  <UploadOutlined className="me-2" />
                  {values.file?.name || "No file chosen"}

                  <input
                    type="file"
                    name="file"
                    accept=".xls, .xlsx"
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onChange={(event) =>
                      setFieldValue("file", event.currentTarget.files[0])
                    }
                  />
                </div>
                {values.file ? (
                  <span>{values.file.name}</span>
                ) : (
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-danger mt-1"
                  />
                )}
              </div>
            </div>

            <div className="m-5 text-center">
              <Space>
                <Button
                  className="custom-button"
                  style={{
                    background: "#F2F2F2",
                    color: "#000",
                    border: "none",
                  }}
                  icon={<img src={arrowIcon} alt="back" />}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>

                <Button
                  className="custom-button"
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() =>
                    validateForm().then((errors) => {
                      if (Object.keys(errors).length) {
                        setTouched({ file: true });
                      } else {
                        submitForm();
                      }
                    })
                  }
                >
                  Upload
                </Button>

                <Button
                  className="custom-button"
                  style={{
                    border: "2px solid #1890ff",
                    color: "#1890ff",
                    background: "transparent",
                  }}
                  icon={<img src={crossIcon} alt="clear" />}
                  onClick={() => resetForm()}
                >
                  Clear
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StationImportForm;
