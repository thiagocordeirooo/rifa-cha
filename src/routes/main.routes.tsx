import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "../common/components/layouts/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import MyBetsPage from "../pages/MyBetsPage/MyBetsPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ReportPage from "../pages/ReportPage/ReportPage";
import SorterPage from "../pages/SorterPage/SorterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "my-bets/:phone?",
        element: <MyBetsPage />,
      },
      {
        path: "d",
        element: <ReportPage />,
      },
      {
        path: "sorter",
        element: <SorterPage />,
      },
      {
        path: "*",
        element: <HomePage />,
      }
    ],
  },
]);

const MainRoutes = () => <RouterProvider router={router} />;

export default MainRoutes;
