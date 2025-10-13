import express from "express";
import authRoute from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/cart.route.js";
import ratingAndReviewsRoutes from "./routes/ratingAndReview.route.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/ratingAndReview", ratingAndReviewsRoutes)
app.use("/api/v1/admin", adminRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;