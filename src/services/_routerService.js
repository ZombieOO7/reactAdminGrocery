// routes
import Dashboard from "../routes/DashBoard/Dashboard";
import Users from "../routes/Users/Users";
import AddEditUser from "../routes/Users/AddEditUsers";
import Details from "../routes/Users/UserDetails";
import Page from "../routes/Page/Page";
import AboutUs from "../routes/Pages/Aboutus";
import Terms from "../routes/Pages/TermsAndConditions";
import PrivacyPolicy from "../routes/Pages/PrivacyPolicy";
import ContactUs from "../routes/Pages/Contactus";
import ChangePassword from "../routes/ChangePassword/ChangePassword";
import AddEditCategory from "../routes/Category/create";
import categoryListing from "../routes/Category/listing";
// import ArticlesListing from "../routes/Articles/Articles";
// import AddEditArticle from "../routes/Articles/AddEditArticle";
import subCategoryListing from "../routes/subCategory/listing";
import AddEditSubCategory from "../routes/subCategory/create";
import CMSPages from "../routes/CmsPages/CmsPages";
import AddEditCmsPage from "../routes/CmsPages/AddEditCmsPage";

export default [
  {
    path: "Dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "users",
    component: Users,
    exact: true,
  },
  {
    path: "users/addeditusers",
    component: AddEditUser,
    exact: true,
  },
  {
    path: "category",
    component: categoryListing,
    exact: true,
  },
  {
    path: "category/addEditCategory",
    component: AddEditCategory,
    exact: true,
  },
  {
    path: "subCategory",
    component: subCategoryListing,
    exact: true,
  },
  {
    path: "subCategory/createUpdate",
    component: AddEditSubCategory,
    exact: true,
  },
  {
    path: "Details",
    component: Details,
    exact: true,
  },
  {
    path: "page",
    component: Page,
    exact: true,
  },
  {
    path: "changepassword",
    component: ChangePassword,
    exact: true,
  },
  {
    path: "AboutUs",
    component: AboutUs,
    exact: true,
  },
  {
    path: "ContactUs",
    component: ContactUs,
    exact: true,
  },
  {
    path: "TermsAndCondition",
    component: Terms,
    exact: true,
  },
  {
    path: "PrivacyPolicy",
    component: PrivacyPolicy,
    exact: true,
  },
  // {
  //   path: "Articles",
  //   component: ArticlesListing,
  //   exact: true,
  // },
  // {
  //   path: "Articles/AddEditArticle",
  //   component: AddEditArticle,
  //   exact: true,
  // },
  {
    path: "CMSPages",
    component: CMSPages,
    exact: true,
  },
  {
    path: "CMSPages/AddEditCmsPage",
    component: AddEditCmsPage,
    exact: true,
  }
];
