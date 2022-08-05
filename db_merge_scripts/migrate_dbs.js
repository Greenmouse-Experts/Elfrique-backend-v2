const old_db = require("./old_db.json");
const { adminuser, profile, url, trivia } = require("../models");
const generateUniqueId = require("generate-unique-id");

module.exports = (req, res) => {
  const text = "migrating...";
  res.send(text);
  console.log(text);
  // sync_admins_and_profiles()
  // sync_urls();
  sync_trivia();
};

const getItemsFromJson = (data, table) => {
  let res = [];
  old_db.map((item) =>
    item.type === "table" && item.data && item.name === table
      ? (res = item.data)
      : console.log()
  );
  return res;
};

const sync_admins_and_profiles = () => {
  ////ToDo: Sync date added and edited.
  const old_admins = getItemsFromJson(old_db, "organisers");

  old_admins.forEach(async (admin) => {
    let _role = admin.bank ? "seller" : "normalUser";
    if (admin.admin_level > 0) {
      _role = "admin";
    }
    let uniqueRef = generateUniqueId({
      length: 8,
      useLetters: true,
    });
    try {
      const newAdmin = await adminuser.create({
        firstname: admin.first_name,
        lastname: admin.last_name,
        phonenumber: admin.phone,
        email: admin.email,
        password: admin.password,
        referral_email: admin.ref_email,
        role: _role,
        email_token: admin.password_reset_token,
        activated: admin.verification_status,
        reference: uniqueRef,
        //referral_id:xxxx   //not needed
      });
      console.log("Admin create", newAdmin.id, newAdmin.firstname);
      try {
        const newProfile = await profile.create({
          firstname: admin.first_name,
          lastname: admin.last_name,
          phonenumber: admin.phone,
          email: admin.email,
          accountnumber: admin.account_number,
          accountname: admin.account_name,
          about: admin.about,
          bankname: admin.bank,
          gender: admin.gender,
          twitterURL: admin.twitter_url,
          facebookURL: admin.facebook_url,
          instagramURL: admin.instagram_url,
          adminuserId: newAdmin.id,
        });
        console.log("Profile create", newProfile.id, newProfile.firstname);
      } catch (error) {
        console.log("failed to create profile", admin.first_name); //error);
      }
    } catch (error) {
      console.log("failed to create", admin.first_name); //error);
    }
  });
};

const sync_urls = async () => {
  ////ToDo: Sync date added and edited.
  const old_urls = getItemsFromJson(old_db, "urls");
  const old_admins = getItemsFromJson(old_db, "organisers");
  old_urls.forEach(async (_url) => {
    // Get admin id
    old_admins.forEach(async (_admin_) => {
      if (_admin_.id === _url.organiser_id) {
        const organiserEmail = _admin_.email;

        const _user = await adminuser.findOne({
          where: { email: organiserEmail },
        });
        //create
        try {
          const newUrl = await url.create({
            longUrl: "",
            shortUrl: _url.url,
            urlCode: _url.alias,
            userId: _user.id,
            //date: new Date()
          });
          console.log("url created:", newUrl.id);
        } catch (error) {
          console.log("failed to create url", _url.alias); //error);
        }
      }
    });
  });
};

const sync_trivia = () => {
  ////ToDo: Sync date added and edited.
  const old_trivia = getItemsFromJson(old_db, "trivia_details");
  const old_admins = getItemsFromJson(old_db, "organisers");
  old_trivia.forEach(async (_trivia) => {
    // Get admin id
    old_admins.forEach(async (_admin_) => {
      if (_admin_.id === _trivia.organiser_id) {
        const organiserEmail = _admin_.email;

        const _user = await adminuser.findOne({
          where: { email: organiserEmail },
        });
        //create
        try {
          const newTrivia = await trivia.create({
            title: _trivia.title,
            image: _trivia.image ? `/uploads/${_trivia.image}` : null,
            details: _trivia.detail,
            instruction: _trivia.instruction,
            duration: _trivia.duration,
            type: _trivia.type,
            numberoftimes: _trivia.times_to_answer,
            adminuserId: _user.id,
          });
          console.log("trivia created:", newTrivia.title);
        } catch (error) {
          console.log("failed to create url", _trivia.title); //error);
        }
      }
    });
  });
};
