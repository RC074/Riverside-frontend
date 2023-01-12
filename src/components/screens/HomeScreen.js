// import data from "../data";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Parallax } from "react-scroll-parallax";

const AWS_SERVER =
  "http://riverside-backend.eba-m9sfjqxt.us-east-2.elasticbeanstalk.com";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(AWS_SERVER + "/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Riverside</title>
      </Helmet>

      <Parallax speed={100} startScroll={-800} endScroll={1600}>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {products.map((product, index) => (
                <Col key={index} sm={12} md={6} lg={4}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Parallax>
    </div>
  );
};

export default HomeScreen;
