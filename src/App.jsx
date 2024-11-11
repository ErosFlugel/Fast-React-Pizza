import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import AppLayout from "./ui/AppLayout";
import { action as updateOrderAction } from "./features/order/UpdateOrder";

//We use this way of creating the routes to enable data fetching or data loading for the routes in react-router 6.4
const router = createBrowserRouter([
  //Here we define that the home page will contain the <AppLayout> component and that all the following children components are the nested routes
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        //The errors will bubbled up to the root (<AppLayout>) unless we handle the error within the route it was first originated
        errorElement: <Error />,
        //This way of fetching is better because it will start fetching once the url is entered instead of doing it after the component is rendered
        loader: menuLoader,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        //Whenever the form submits something, the action will be called
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        errorElement: <Error />,
        loader: orderLoader,
        //The form we want to submit is not in the actual page but in a child page UpdateOrder
        action: updateOrderAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
