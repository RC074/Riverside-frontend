import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState, useContext } from "react";
import axios from "axios";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Rating from "../Rating";
import { Helmet } from "react-helmet-async";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { Store } from "../../Store";

const AWS_SERVER =
  "http://riverside-backend.eba-m9sfjqxt.us-east-2.elasticbeanstalk.com";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(
          AWS_SERVER + `/api/products/slug/${slug}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      AWS_SERVER + `/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row style={{ justifyContent: "center", alignItems: "center" }}>
        <Col lg={6} sm={12} style={{ margin: "2rem" }}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col lg={3} sm={12}>
          <ListGroup variant="flush">
            <ListGroup.Item
              style={{ color: "#fff", background: "rgba(3, 72, 47, 0.2)" }}
            >
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item style={{ background: "rgba(3, 72, 47, 0.2)" }}>
              <Rating
                green={true}
                rating={product.rating}
                reviewsCount={product.reviewsCount}
              />
            </ListGroup.Item>

            <ListGroup.Item
              style={{ color: "#fff", background: "rgba(3, 72, 47, 0.2)" }}
            >
              <strong>Price:</strong> ${product.price}
            </ListGroup.Item>
            <ListGroup.Item
              style={{ color: "#fff", background: "rgba(3, 72, 47, 0.2)" }}
            >
              <strong>Description:</strong>
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
          <Card
            style={{
              color: "#fff",
              background: "rgba(3, 72, 47, 0.2)",
              borderRadius: "0",
            }}
          >
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item
                  style={{ color: "#fff", background: "transparent" }}
                >
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item
                  style={{ color: "#fff", background: "transparent" }}
                >
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.inStockCount > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.inStockCount > 0 && (
                  <ListGroup.Item
                    style={{
                      color: "#fff",
                      background: "transparent",
                    }}
                  >
                    <div className="d-grid">
                      <Button
                        className="btn-p"
                        style={{ marginTop: "1rem" }}
                        onClick={addToCartHandler}
                        variant="primary"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
