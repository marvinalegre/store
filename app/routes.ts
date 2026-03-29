import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/product-catalog.tsx"),
  route("products", "routes/product-page.tsx"),
] satisfies RouteConfig;
