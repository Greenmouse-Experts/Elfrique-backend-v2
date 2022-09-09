const express = require("express");
const Auth = require("../middleware/UserAuth");

const AuthController = require("../controllers/Auth");

const ProfileController = require("../controllers/profile");

const VoteContestController = require("../controllers/VotingContest");
const AdminController = require("../controllers/admin.controller");

const AwardContestController = require("../controllers/AwardContest");

const EventController = require("../controllers/EventController");

const TicketController = require("../controllers/TicketController");

const TriviaController = require("../controllers/TriviaController");
const TravelsAndToursController = require("../controllers/TravelsAndToursController");

const {
  AddNotification,
  findAllNotification,
  deleteNotification,
  deleteAllNotification,
} = require("../controllers/notifications");

const SuperAdminController = require("../controllers/SuperAdminController");

const ReferralController = require("../controllers/referral");

const FormController = require("../controllers/FormController");

const SearchController = require("../controllers/searchController");

const upload = require("../helpers/upload");

const urlControl = require("../controllers/urlcontroller");

const BlogController = require("../controllers/BlogController");

const EvisaController = require("../controllers/EvisaController");

const PayoutController = require("../controllers/PayoutController");

const {
  createProfile,
  updateProfile,
  getProfile,
  getAllProfile,
  deleteProfile,
  getProfileUser,
} = require("../controllers/vendorprofile");

const multer = require("../helpers/multer");

const transactionController = require("../controllers/TransactionController");

const {
  createPrice,
  getSubPrice,
  deletePrice,
  updatePrice,
  verify,
} = require("../controllers/Subprice");

const {
  createReview,
  getAllReviews,
  getReviewUserJobs,
  updateReview,
  deleteReview,
  getReviewOnSellerJobs,
  getReviewOnUserJobs,
} = require("../controllers/review");

const {
  createProposal,
  getAllProposal,
  getProposalUser,
  getProposalSeller,
  deleteProposal,
  updateProposal,
} = require("../controllers/proposal");

const { checkRole } = require("../controllers/checkrole");

const {
  createAds,
  getAdbyUser,
  getAllAdsbyUser,
  getAllAds,
  deleteAds,
  updateAds,
} = require("../controllers/AdsController");

const {
  registerValidation,
  validate,
  loginValidation,
  resetPasswordValidation,
  changePasswordValidation,
  createVoteValidation,
  createAwardValidation,
  createEventValidation,
  createTicketsValidation,
  createTriviaValidation,
  createFormValidation,
  createQuestionValidation,
} = require("../helpers/validator");
const { contactUs } = require("../controllers/contactUs");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome To elfrique API");
});

router.post(
  "/signup",
  registerValidation(),
  validate,
  AuthController.registerUser
);

router.post("/login", loginValidation(), validate, AuthController.login);

router.get("/verifyemail", AuthController.verifyEmail);

router.post(
  "/resetpassword",
  resetPasswordValidation(),
  validate,
  AuthController.resetpassword
);

router.post("/getpasswordlink", AuthController.postresetlink);

router.get("/getuserProfile", Auth, ProfileController.getUserProfile);

router.post("/edituserProfile", Auth, ProfileController.editUserProfile);

router.get("/getDashboard", AdminController.getDashboard);

router.post(
  "/changepassword",
  Auth,
  changePasswordValidation(),
  validate,
  ProfileController.changePassWord
);

// Notification
router.post("/addNotification", AddNotification);

router.get("/findUserNotification", findAllNotification);

router.delete("/deleteNotification/:id", deleteNotification);
router.delete("/deleteAllNotification/:id", deleteAllNotification);
// become a seller
router.post("/becomeSeller", Auth, ProfileController.becomeASeller);

router.post(
  "/createVote",
  Auth,
  upload.single("image"),
  createVoteValidation(),
  validate,
  VoteContestController.createVoteContest
);

router.get("/getallVote", Auth, VoteContestController.getallVOteContest);

router.get("/getVote/:id", VoteContestController.getSingleVoteContest);

router.patch("/updateVote/:id", Auth, VoteContestController.updateVoteContest);

router.post(
  "/createAward",
  Auth,
  upload.single("image"),
  createAwardValidation(),
  validate,

  AwardContestController.createAwardContest
);

router.get("/allVoteContest", VoteContestController.findAllVoteContest);

router.get("/getallAward", Auth, AwardContestController.getAllAwardsContest);

router.get("/getAward/:id", AwardContestController.getSingleAwardContest);

router.post(
  "/createContestant/:id",
  Auth,
  upload.single("image"),
  VoteContestController.createContestants
);

router.get("/getallContestant/:id", VoteContestController.getAllContestants);

router.get("/getContestant/:id", VoteContestController.getSingleContestant);

router.post(
  "/addSponsor/:id",
  Auth,
  upload.single("image"),
  VoteContestController.addSponsor
);

router.post("/addInfo/:id", Auth, VoteContestController.addInfo);

router.post(
  "/createCategories/:id",
  Auth,
  AwardContestController.createAwardCategories
);

router.get(
  "/getallCategories/:id",
  AwardContestController.getAllAwardCategories
);

router.get("/getSingleCategory/:id", AwardContestController.getSingleCategory);

router.post(
  "/createNominees/:title/:id",
  Auth,
  upload.single("image"),
  AwardContestController.createAwardNominees
);

router.get("/getSingleNominee/:id", AwardContestController.getSingleNominee);

router.get("/allAwards", AwardContestController.findAllAwards);

//--------------------vote contestant--------------

router.post("/vote/:contestantId", VoteContestController.voteAContestant);

//----------------------events routes
router.post(
  "/createEvent",
  upload.single("image"),
  createEventValidation(),
  validate,
  Auth,
  EventController.createEvents
);

router.get("/getAllUserEvents", Auth, EventController.getAllUserEvents);

router.get("/getSingleEvent/:id", EventController.getSingleEvent);

router.delete("/deleteEvent/:id", Auth, EventController.deleteEvent);

router.patch("/updateEvent/:id", Auth, EventController.editEvent);

//-----Events referrals----
router.get(
  "/userEventReferrals",
  Auth,
  EventController.getAllUserEventReferrals
);
router.get(
  "/userEventReferrals/:eventId",
  Auth,
  EventController.getSpecificUserEventReferrals
);
router.get(
  "/userEventReferrals/referral/:id",
  Auth,
  EventController.getSingleUserEventReferral
);
router.post("/UserEventReferral", Auth, EventController.addEventReferral);
router.patch("/userEventReferral", Auth, EventController.updateEventReferral);

router.delete(
  "/userEventReferral/:eventRefId",
  Auth,
  EventController.deleteEventReferral
);

router.post(
  "/createTickets/:id",
  Auth,
  createTicketsValidation(),
  validate,
  TicketController.createTickets
);
router.get("/getAllTickets/:id", Auth, TicketController.getAllTicketsById);

router.get("/allEvents", EventController.findAllEvents);

//-----Trivia
router.post(
  "/createTrivia",
  Auth,
  upload.single("image"),
  createTriviaValidation(),
  validate,
  TriviaController.createTrivia
);

router.post(
  "/addQuestion/:id",
  upload.single("image"),
  Auth,
  TriviaController.addQuestion
);

//update question
router.patch(
  "/updateQuestion/:id",
  upload.single("image"),
  Auth,
  TriviaController.updateQuestions
);

router.get("/getAllTrivia", Auth, TriviaController.getAllTrivia);

router.patch(
  "/updateTrivia/:id",
  upload.single("image"),
  Auth,
  TriviaController.updateQuestions
);

router.get("/allTrivia", TriviaController.findAllTrivias);

router.get("/getSingleTrivia/:id", TriviaController.getSingleTrivia);

router.post("/createPlayer/:id", TriviaController.addTriviaPlayer);

router.post("/trivia-answer/:triviaId", TriviaController.answerQuestion);

router.get("/getUserRef", Auth, ReferralController.getReferralByUser);

//----------------form routes

router.post(
  "/createForm",
  Auth,
  upload.single("image"),
  createFormValidation(),
  validate,
  FormController.createForm
);

router.post(
  "/buildForm/:id",
  Auth,
  upload.single("image"),
  createQuestionValidation(),
  validate,
  FormController.buildform
);

router.get("/getAllForm", Auth, FormController.getFormByUser);

// router.get("/getForms", FormController.findAllForms);
router.get("/allForms", FormController.findAllForms);

router.get("/getForm/:id", FormController.getForm);

/**
 * createFormReply
 * getFormReplies
 * getFormReplies/:id
 */
router.post(
  "/createFormReply",
  Auth,
  upload.single("image"),
  createFormValidation(),
  validate,
  FormController.createForm
);
router.get("/getFormReplies", Auth, FormController.getFormByUser);
router.get("/getFormReplies/:id", FormController.getForm);

///super admin routes

router.post("/createAdmin", AuthController.createSuperAdmin);

router.post("/adminLogin", AuthController.loginSuperAdmin);

router.get("/getAllUsers", Auth, SuperAdminController.getAllUsers);

router.get("/getAllContests", Auth, SuperAdminController.getAllContest);

router.get("/getAllEvents", Auth, SuperAdminController.getAllEvents);

router.get("/getAllRef", Auth, ReferralController.getUserReferrals);

router.get("/getForms", Auth, SuperAdminController.getAllForms);

router.get("/getTrivias", Auth, SuperAdminController.getAllTrivia);

//-----

//search routes

router.get("/search/:product", SearchController.searchKeyWord);

router.get("/searchVendor/:location", SearchController.searchVendor);

//---------------------------blog----------------------------

router.post(
  "/createBlog",
  upload.single("image"),
  Auth,
  BlogController.createBlog
);

router.get("/getBlogs", BlogController.getAllBlogs);

router.get("/getBlog/:id", BlogController.getABlog);

router.patch(
  "/editBlog/:id",
  upload.single("image"),
  Auth,
  BlogController.updateABlog
);

router.delete("/deleteBlog/:id", Auth, BlogController.deleteABlog);

//------------------------------Evisa------------------

router.post("/submitEvisa", EvisaController.submitApplication);

router.get("/getAllEvisa", Auth, EvisaController.findAllApplication);

router.delete("/deleteEvisa/:id", Auth, EvisaController.deleteApplication);

router.patch("/approveEvisa/:id", Auth, EvisaController.approveApplication);

router.post("/sendMessage/:id", Auth, EvisaController.sendMessage);

router.get("/getAllMessages", Auth, EvisaController.getAllMessages);

//--------------------------------------Travels and Tours--------------------------------------------------------------------
router.get("/flight/airports", TravelsAndToursController.flightAirportsList);
router.post("/flight/search", TravelsAndToursController.flightSearch);
router.post("/flight/select", TravelsAndToursController.flightSelect);
router.post("/flight/book", TravelsAndToursController.flightBook);
router.post("/flight/ticketpnr", TravelsAndToursController.flightTicketpnr);

//--------------------------------- Payout------------------------

router.post("/requestPayout", Auth, PayoutController.requestPayOut);

router.get("/getAllPayout", Auth, PayoutController.getAllPayouts);

router.get("/getUserPayout", Auth, PayoutController.getPayOutByUser);

router.patch("/approvePayout/:id", Auth, PayoutController.approvePayOut);

router.patch("/rejectPayout/:id", Auth, PayoutController.rejectPayOut);

//----------------------------------------------------JOB and PROPOSAL-------------------------------

router.post(
  "/createjob/:eventId",
  Auth,
  upload.single("image"),
  EventController.createJob
);

router.put(
  "/updatejobimage/:jobId",
  Auth,
  upload.single("image"),
  EventController.updateJobImage
);

router.put("/updatejob/:jobId", Auth, EventController.updateJob);

router.get("/getjob/:id", EventController.getJob);

router.get("/getAllJob", EventController.getAllJob);

router.get("/getAllSellerJob", Auth, EventController.getAllJobSeller);

router.get("/getAlljob/:eventId", Auth, EventController.getAllJobEvent);

router.delete("/deletejob/:eventId/:id", Auth, EventController.deleteJob);
//-----------------------------------------Assign Job --------------------------------
router.get("/assignJob/:jobId/:userId", Auth, EventController.assignedJob);

router.get("/viewAssignedjobs", Auth, EventController.viewAllAssignedJob);

router.get("/viewAssignedjob/:jobId", Auth, EventController.viewAssignedJob);

router.get(
  "/viewAssignedjobuser/:jobId/:userId",
  Auth,
  EventController.viewAssignedJobUser
);

//------------------------------------------------Search-------------------------------------------------------
router.get("/search", EventController.searchJob);

//----------------------------------------------Proposal--------------------------------------------------------------------

router.post("/createProposal/:jobId", createProposal);

router.get("/getProposalbyuser/:jobId", Auth, getProposalUser);

router.get("/getProposalbyseller/:jobId/:userId", Auth, getProposalSeller);

router.get("/getAllProposal/:jobId", Auth, getAllProposal);

router.patch("/updateProposal/:jobId", Auth, updateProposal);

router.delete("/deleteProposal/:jobId", Auth, deleteProposal);

//-----------------------------------------------------Short Url--------------------------------------------------

router.post("/createAds", Auth, upload.single("image"), createAds);

router.get("/getadbyuser/:id", Auth, getAdbyUser);

router.get("/getUserAds", Auth, getAllAdsbyUser);

router.get("/getAllAds", getAllAds);

router.put("/updateAds/:id", Auth, upload.single("image"), updateAds);

router.delete("/deleteAds/:id", Auth, deleteAds);

router.route("/url/shorten").post(Auth, urlControl.createUrl);

router.get("/url/getShortUrl", urlControl.getShortUrl);
router.get("/url/getallUrl", Auth, urlControl.getAllUrlUser);

router.delete("/url/deleteUrl/:id", Auth, urlControl.deleteUrlUser);

//--------------------------------------REVIEW-----------------------------------------------

router.post("/createReview/:jobId/:id", Auth, createReview);

router.put("/updateReview/jobId/:id", Auth, updateReview);

router.get("/getUserReviews", Auth, getReviewOnUserJobs);

router.get("/getSellerReviews", Auth, getReviewOnSellerJobs);

router.get("/getAllReviews", Auth, getAllReviews);

router.delete("/deleteReview/jobId/:id", Auth, deleteReview);

//------------------------------------Vendor Profile----------------------------------------------------------------

router.post("/createVendorProfile", Auth, multer.array("image"), createProfile);
router.put("/updateVendorProfile", Auth, multer.array("image"), updateProfile);
router.delete("/deleteVendorProfile", Auth, deleteProfile);
router.get("/getAllVendorProfile", Auth, getAllProfile);
router.get("/getVendorProfile/:id", Auth, getProfile);
router.get("/getVendorProfileUser", Auth, getProfileUser);

//--------------------------------------Transactions--------------------------------------------------------------------
router.get(
  "/getAllTransactions",
  Auth,
  transactionController.transactionHistoryByUser
);

router.post("/makeTransaction", transactionController.makeTransaction);

//-----------------------------------------Payment Ads & Vendor Sub------------------------------------------------
router.post("/createprice", Auth, createPrice);

router.put("/updateprice", Auth, updatePrice);

router.get("/getprice", Auth, getSubPrice);

router.get("/pay/verify", Auth, verify);

router.delete("/deleteprice/:id", Auth, deletePrice);

//---------------------------------------------------------Contact Us--------------------------------------------------
router.post("/contact-us", contactUs);

module.exports = router;
