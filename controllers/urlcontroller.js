const Url = require('../models').url;
const validUrl = require('valid-url');
const shortid = require('shortid');
const parse = require('url-parse')
require('dotenv').config

exports.getShortUrl = async (req, res, next) => {
  try {
    await Url.findOne({
      where: {
        urlCode: `${req.query.alias}`,
      },
    }).then((url) => {
      if (url) {
        return res.redirect(url.longUrl);
      } else {
        return res.status(404).json("No url Found");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.GetUrl = async (req, res, next) => {
  try {
    await Url.findOne({
      where: {
        urlCode: `${req.params.code}`,
      },
    }).then((url) => {
      if (url) {
        return res.redirect(url.longUrl);
      } else {
        return res.status(404).json("No url Found");
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.createUrl = async (req, res, next) => {
  const { longUrl, alias } = req.body;
  const baseUrl = process.env.BASEURL;
  const frontUrl = process.env.FRONTURL;


  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid Base Url");
  }

  var addr = new parse(longUrl);
  var addr2 = new parse(frontUrl);

  const urlCode = shortid.generate();
console.log("host nammmemes\n\n\n", addr, addr2);
  if (validUrl.isUri(longUrl)) {
    // if (addr.hostname === addr2.hostname) {
    try {
      var url = await Url.findOne({
        where: {
          longUrl: `${longUrl}`,
          userId: req.user.id,
        },
      });
      if (url) {
        res.status(200).json(url);
      } else {
        if (alias) {
          // const shortUrl = `${baseUrl}/${alias}`;
          const shortUrl = `${frontUrl}/s/${alias}`;
          url = new Url({
            longUrl,
            shortUrl,
            urlCode: alias,
            userId: req.user.id,
            //date: new Date()
          });
          await url.save();
          res.status(200).json(url);
        } else {
          const shortUrl = `${frontUrl}/s/${urlCode}`;
          url = new Url({
            longUrl,
            shortUrl,
            urlCode,
            userId: req.user.id,
            //date: new Date()
          });
          await url.save();
          res.status(200).json(url);
        }
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
    // } else {
    //   res.status(401).json("Other Host not allowed");
    // }
  } else {
    res.status(401).json("Invalid Url");
  }
};

exports.getAllUrlUser = async (req, res, next) => {
  try {
    await Url.findAll({
      where: {
        userId: req.user.id,
      },
    }).then((url) => {
      if (url) {
        res.status(200).json({
          status: true,
          data: url,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "No URL Found",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};



exports.deleteUrlUser = async(req, res, next)=>{
    try {
        await Url.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        })
        res.status(200).json({
            status: true,
            message: "URL Deleted"
        })
            
        
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

