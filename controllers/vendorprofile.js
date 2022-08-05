const Vendorprofile = require('../models').vendorprofile
const User = require('../models').adminuser
const cloudinary = require('../helpers/cloudinary2')
const Vendorsub = require('../models').vendorsub
const fs = require('fs')



exports.createProfile = async(req, res, next)=>{
    const { description, tag} = req.body;
    try {

        const check = await Vendorprofile.findOne({
            where: {
                userId: req.user.id
            }
        })
        if(check){
            res.status(403).json("Vendor profile already created")
        }else{
            const uploader = async (path) => await cloudinary.uploads(path, 'Images');
        
            const urls = [];
            const ids = []
            const files = req.files;
            for (const file of files){
                const { path } = file;
                const newPath = await uploader(path)
                urls.push(newPath.url);
                ids.push(newPath.id)
                fs.unlinkSync(path)
            }

            const profile = new Vendorprofile({
                userId: req.user.id,
                description,
                tag,
                img_id: JSON.stringify(ids),
                img_url: JSON.stringify(urls)
            })

            await Vendorsub.findOne({
                where:
                {
                    userId: req.user.id
                }
            }).then(async(vendorsub) => {
                if(!vendorsub){
                    var somedate = new Date()
                    somedate.setDate(somedate.getDate() + 7);
                   
                    var newSub = new Vendorsub({
                        userId: req.user.id,
                        sub_type: "free",
                        status: 'active',
                        end_date: `${somedate}`
                    })
                    
                    var saved = await newSub.save()
                    const saveprofile = await profile.save();
                    saveprofile.img_url =JSON.parse(saveprofile.img_url);
                    saveprofile.img_id = JSON.parse(saveprofile.img_id);
                    res.status(201).json({
                        profile: saveprofile,
                        subscription: saved
                    })
                   
                }
            })
           
        
        }
        
        
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getProfile = async(req, res, next)=>{

    try {
        const profile = await Vendorprofile.findOne({
            where:{
                userId: req.params.id
            }, include:[
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]
        })
        if(profile){
            profile.img_url =JSON.parse(profile.img_url);
            profile.img_id = JSON.parse(profile.img_id);
            res.status(200).json(profile)
        }else{
            res.status(404).json({
                status: false,
                message: "Profile not found!"
            })
        }

    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getProfileUser = async(req, res, next)=>{

    try {
        const profile = await Vendorprofile.findOne({
            where:{
                userId: req.user.id
            }, include:[
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]
        })
        if(profile){
            profile.img_url =JSON.parse(profile.img_url);
            profile.img_id = JSON.parse(profile.img_id);
            res.status(200).json(profile)
        }else{
            res.status(404).json({
                status: false,
                message: "Profile not found!"
            })
        }

    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getAllProfile = async(req, res, next)=>{
    try {
        const profile = await Vendorprofile.findAll({
             include:[
                {
                    model: User,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]
        })
        if(profile){
            for(let i=0; i<profile.length; i++){
                profile[i].img_id = JSON.parse(profile[i].img_id);
                profile[i].img_url = JSON.parse(profile[i].img_url);
            }
            res.status(200).json(profile)
        }else{
            res.status(404).json({
                status: false,
                message: "Profile not found!"
            })
        }

    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.updateProfile = async(req, res, next)=>{
    try {
        const { description, tag } = req.body;
   
        if(req.file || req.files) {
            const uploader = async (path) => await cloudinary.uploads(path, 'Images');
            
                const urls = [];
                const ids = []
                const files = req.files;
                for (const file of files){
                    const { path } = file;
                    const newPath = await uploader(path)
                    urls.push(newPath.url);
                    ids.push(newPath.id)
                    fs.unlinkSync(path)
                }
             await Vendorprofile.update({
                description,
                tag,
                img_id: JSON.stringify(ids),
                img_url: JSON.stringify(urls),
            }, { where: {
               
                userid: req.user.id,
               
            }})
            res.status(200).json({
                status: true,
                message: "Profile updated"
            })
        } else{
            await Vendorprofile.update({
               description,
               tag,
            }, { where: {
                userid: req.user.id,
            }})
            res.status(200).json({
                status: true,
                message: "Profile updated"
            })
        }   
        
    } catch (error) {
        next(error);
        console.log(error)
    }
}

exports.deleteProfile = async(req, res, next)=>{
    try {
        await Vendorprofile.findOne({
            where: {
                userId: req.user.id
            }
        })
        .then(async (profile) => {
            if(profile){
                profile.img_id = JSON.parse(profile.img_id);
                for(let i=0; i<profile.img_id.length; i++){
                    await cloudinary.cloudinary.uploader.destroy(profile.img_id[i]);
                }
                await Vendorprofile.destroy({
                    where:{
                        userId: profile.id
                    }
                })
                res.json("Profile deleted successfully")
            }else{
                res.json("Profile not found")
            }
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
}