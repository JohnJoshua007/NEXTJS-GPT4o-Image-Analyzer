"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Vision = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  //form
  const formik = useFormik({
    initialValues: {
      text: "",
      image_url: "",
    },
    validationSchema: Yup.object({
      text: Yup.string().required("Text is Required"),
      image_url: Yup.string()
        .url("Invalid URL")
        .required("Image URL is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true), setError(null), setResponse(null);
      try {
        const res = await fetch("/api/vision", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          throw new Error("Failed to fetch the response");
        }
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h1>Image Analyzer</h1>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name="text"
          placeholder="Enter text here"
          {...formik.getFieldProps("text")}
        ></textarea>
        <input
          name="image_url"
          {...formik.getFieldProps("image_url")}
          placeholder="Enter image URL here"
        />
        <button type="submit">Get Response</button>
      </form>
      {/* response */}
      {response && (
        <div>
          <h2>Response:</h2>
          {response?.message?.content && <p>{response?.message?.content}</p>}
        </div>
      )}
      {formik?.values?.image_url && (
        <div>
          <img src={formik?.values?.image_url} />
        </div>
      )}
    </div>
  );
};

export default Vision;
