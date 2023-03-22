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
import AddEditInterest from "../routes/Interest/AddEditInterest";
import InterestListing from "../routes/Interest/InterestListing";
import GrowthDetails from "../routes/Users/GrowthDetails";
import NursingDetails from "../routes/Users/NursingInformation";
import PumpingDetails from "../routes/Users/PumpingInformation";
import ArticlesListing from "../routes/Articles/Articles";
import AddEditArticle from "../routes/Articles/AddEditArticle";
import MeditationListing from "../routes/Meditation/MeditationListing";
import AddEditMeditation from "../routes/Meditation/AddEditMeditation";
import VideoListing from "../routes/Video/VideoListing";
import AddEditVideo from "../routes/Video/AddEditVideo";
import MilestoneListing from "../routes/Milestone Mangement/Milestone";
import AddEditMilestone from "../routes/Milestone Mangement/AddEditMilestone";
import ConsultantListing from "../routes/Consultant/Consultant";
import AddEditConsultant from "../routes/Consultant/AddEditConsultant";
import NotificationListing from "../routes/Notifications/NotificationListing";
import AddEditNotification from "../routes/Notifications/AddEditNotification";
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
    path: "interests",
    component: InterestListing,
    exact: true,
  },
  {
    path: "interests/addEditInterest",
    component: AddEditInterest,
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
  {
    path: "GrowthDetails",
    component: GrowthDetails,
    exact: true,
  },
  {
    path: "NursingDetails",
    component: NursingDetails,
    exact: true,
  },
  {
    path: "PumpingDetails",
    component: PumpingDetails,
    exact: true,
  },
  {
    path: "Articles",
    component: ArticlesListing,
    exact: true,
  },
  {
    path: "Articles/AddEditArticle",
    component: AddEditArticle,
    exact: true,
  },
  {
    path: "Meditation",
    component: MeditationListing,
    exact: true,
  },
  {
    path: "Meditation/AddEditMeditation",
    component: AddEditMeditation,
    exact: true,
  },
  {
    path: "Video",
    component: VideoListing,
    exact: true,
  },
  {
    path: "Video/AddEditVideo",
    component: AddEditVideo,
    exact: true,
  },
  {
    path: "Milestone",
    component: MilestoneListing,
    exact: true,
  },
  {
    path: "Milestone/AddEditMilestone",
    component: AddEditMilestone,
    exact: true,
  },
  {
    path: "Consultant",
    component: ConsultantListing,
    exact: true,
  },
  {
    path: "Consultant/AddEditConsultant",
    component: AddEditConsultant,
    exact: true,
  },
  {
    path: "CMSPages",
    component: CMSPages,
    exact: true,
  },
  {
    path: "CMSPages/AddEditCmsPage",
    component: AddEditCmsPage,
    exact: true,
  },
  {
    path: "Notification",
    component: NotificationListing,
    exact: true,
  },
  {
    path: "Notification/AddEditNotification",
    component: AddEditNotification,
    exact: true,
  },
];
