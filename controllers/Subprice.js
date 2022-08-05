const { Op } = require('sequelize');
const Subprice = require('../models').subprice;
const User = require('../models').adminuser;
const Transaction = require('../models').vendortransaction;
const Vendorsub = require('../models').vendorsub;
const Vendorprofile = require('../models').vendorprofile;
const Adsub = require('../models').adssubscription;
require('dotenv').config()
const paystack = require("paystack")(process.env.PAYSTACK_SECRET)



exports.createPrice = async(req, res, next)=>{
    const {sub_type, price, interval, description} = req.body;
    try {
        await Subprice.findOne({
            where:{
                sub_type: sub_type
            }
        }).then(async (subprice) =>{
            if(subprice){
                res.json({
                    status: false,
                    message: "Price was already created for this plan"
                })
            }else{
                paystack.plan.create({
                    name: `${sub_type.toUpperCase()}`,
                    description: description,
                    amount: parseInt(price) * 100,
                    interval: `${interval}`,
                    invoice_limit: 0,
                    
                }).then(async (body) =>{
                    
                    paystack.page.create({
                        name:`${sub_type.toUpperCase()}`,
                        description: description,
                        plan: body.data.id,
                        amount: parseInt(price) * 100,
                        redirect_url: `${process.env.REDIRECT_SITE}/pay/verify`
                    }).then(async(pagebody) =>{
                        console.log(body)
                        console.log(pagebody)
                        
                        const setprice = new Subprice({
                            sub_type,
                            price,
                            interval,
                            plan_id: `${body.data.id}`,
                            plan_code: `${body.data.plan_code}`,
                            page_url: `https://paystack.com/pay/${pagebody.data.slug}`,
                            page_id: `${pagebody.data.id}`
                        })
                        const result = await setprice.save();
                        res.json({
                            status: true,
                            message: `Price set successfully`,
                            result
                        })
                    })
                       
                    
                }).catch((error) => console.error(error))
               
            }
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.updatePrice = async(req, res, next)=>{
    const { sub_type, price, interval, description} = req.body;
    try {
        await Subprice.findOne({
            where:{
                sub_type: sub_type
            }
        }).then( async (subprice) =>{
            if(subprice){
                paystack.plan.update(parseInt(subprice.plan_id),{
                    name: `${sub_type.toUpperCase()}`,
                    amount: parseInt(price),
                    interval: `${interval}`,
                    description: description,
                    invoice_limit: 0,
                }).then(async(body) =>{
                    paystack.page.update(parseInt(subprice.page_id),{
                        name:`${sub_type.toUpperCase()}`,
                        description: description,
                        amount: parseInt(price) * 100,
                    }).then(async(pagebody) =>{
                        await Subprice.update({
                            sub_type: sub_type,
                            price: price,
                            interval,
                            plan_id: `${body.data.id}`,
                            plan_code: `${body.data.plan_code}`,
                            page_url: `https://paystack.com/pay/${pagebody.data.slug}`,
                            page_id: `${pagebody.data.id}`
                        }, {
                            where:{
                                id: subprice.id
                            }
                        }).then((update) =>{
                            res.json({
                                status: true,
                                message: "Price Updated"
                            })
                        }).catch(err=> console.log(err))
                    }).catch(err=> console.log(err))
                    
                }).catch(err=> console.log(err))
            
            }else{
                res.json({
                    status: false,
                    message: "Subscription type not found"
                })
            }
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.deletePrice = async(req, res, next)=>{
    
    try {
        await Subprice.findOne({
            where: {
                id: req.params.id
            }
        }).then( async(price) =>{
            if(price){
                await Subprice.destroy({
                    where: {
                        id: price.id
                    }
                })
                res.json({
                    status: true,
                    message: "Subscription type deleted but you need to also delete it via paystack dashboard"
                })
            }else{
                res.json({
                    status: false,
                    message: "Subscription type not found"
                })
            }
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}


exports.getSubPrice = async(req, res, next)=>{
    const sub_type = req.query.sub
    try {
        if(!sub_type){
            var prices = await Subprice.findAll()
            res.json(prices);
        }else{
            var prices = await Subprice.findOne({
                where:{
                    sub_type:sub_type
                }
            })
            res.json(prices);
        }
        
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.verify = async( req, res, next)=>{
    const ref = req.query.reference;
    const userId = req.user.id
    try {
        await User.findOne({
            where: {
                id: userId
            }
        }).then(async (user) =>{
            if(user){
                await Transaction.findOne({
                    where:{
                        ref_no: ref
                    }
                }).then(async (trn) => {
                    if(trn){
                        
                        res.json("Payment already verified")
                        
                    }else{
                        paystack.transaction.verify(ref).then(async (transaction) =>{
                        // console.log(transaction)
                        if(!transaction){
                            res.json({
                                status: false,
                                message: `Transaction on the reference no: ${ref} not found`
                            })
                        }

                        var plan_name = `${transaction.data.plan_object.name.toLowerCase()}`
                        // console.log(plan_name);
                        
                    if(plan_name === 'basic' || plan_name ===  'exclusive'){

                            const vendor = await Vendorprofile.findOne({
                                where: {
                                    userId: req.user.id
                                }
                            })
                        if(vendor){
                            console.log(transaction.data.plan_object.name.toLowerCase())
                            var created_date = new Date(transaction.data.created_at);
                            if(transaction.data.plan_object.interval === 'daily'){
                                var days = 1    
                                
                            }else if(transaction.data.plan_object.interval === 'weekly'){
                                days = 7;
                                
                            }else if(transaction.data.plan_object.interval === 'monthly'){
                                days = 30;
                                
                            }else if(transaction.data.plan_object.interval === 'quaterly'){
                                days = 90;
                                
                            }else if(transaction.data.plan_object.interval === 'annually'){
                                days = 365;
                                
                            }else if(transaction.data.plan_object.interval === 'biannually'){
                                days = 730;
                                
                            }
                            created_date.setDate(created_date.getDate() + days)
                            
                            var trnx = new Transaction({
                                userId: req.user.id,
                                ref_no: ref,
                                status: transaction.data.status,
                                sub_type: `${transaction.data.plan_object.name}`,
                                price: `${transaction.data.plan_object.currency} ${transaction.data.plan_object.amount / 100}`,
                                interval: transaction.data.plan_object.interval,
                                start_date: transaction.data.created_at,
                                end_date: `${created_date.toISOString()}`
                            })
                            var savetrnx = await trnx.save()
                            
                            if (savetrnx){

                                await Vendorsub.findOne({
                                    where:{
                                        userId: {
                                            [Op.eq]:  req.user.id,
                                        } 
                                    }
                                }).then(async (vendorsub)=>{
                                    
                                        await Vendorsub.update({
                                            sub_type: savetrnx.sub_type.toLowerCase(),
                                            status: "active",
                                            end_date: `${created_date.toISOString()}`
                                        }, {
                                            where: {
                                                userId: {
                                                    [Op.eq]: vendorsub.userId
                                                } 
                                            }
                                        })
                                    
                                    
                                    res.json({
                                        status: true,
                                        message: `Payment ${transaction.message}`,
                                        transaction: savetrnx,
                                    })
                                }).catch(err => console.error(err))
                            }
                        }else{
                            res.json({
                                status: false,
                                message: "Create a Vendor profile",
                                ref: ref
                            })
                        }
                     
                    } 

                    if(plan_name === "home_page_left" || plan_name ===  "home_page_right" || plan_name === "home_page_slide" || plan_name ===  "inner_page_right" || plan_name ===  "inner_page_left"){
                        // console.log(transaction.data.plan_object.name.toLowerCase() )
                            var created_date = new Date(transaction.data.created_at);
                            if(transaction.data.plan_object.interval === 'daily'){
                                var days = 1    
                                
                            }else if(transaction.data.plan_object.interval === 'weekly'){
                                days = 7;
                                
                            }else if(transaction.data.plan_object.interval === 'monthly'){
                                days = 30;
                                
                            }else if(transaction.data.plan_object.interval === 'quaterly'){
                                days = 90;
                                
                            }else if(transaction.data.plan_object.interval === 'annually'){
                                days = 365;
                                
                            }else if(transaction.data.plan_object.interval === 'biannually'){
                                days = 730;
                                
                            }
                            created_date.setDate(created_date.getDate() + days)
                            //console.log(`${created_date.toISOString()}`)
                            //console.log(transaction.data.plan_object.name.toLowerCase());
                            var trnx = new Transaction({
                                userId: req.user.id,
                                ref_no: ref,
                                status: transaction.data.status,
                                sub_type: `${transaction.data.plan_object.name}`,
                                price: `${transaction.data.plan_object.currency} ${transaction.data.plan_object.amount / 100}`,
                                interval: transaction.data.plan_object.interval,
                                start_date: transaction.data.created_at,
                                end_date: `${created_date.toISOString()}`
                            })
                            var savetrnx = await trnx.save()
                            if(savetrnx){

                            await Adsub.findOne({
                                where: 
                                {
                                userId: {
                                    [Op.eq]:  req.user.id,
                                }
                                    }
                            }).then(async (ads) => {
                                console.log("reach here")
                                if (ads){
                                    if( ads.sub_type === `${savetrnx.sub_type.toLowerCase()}`){
                                        await Adsub.update({
                                            status: "active",
                                            end_date: savetrnx.end_date
                                        }, {
                                            where:{
                                                    id: ads.id,
                                                    userId: req.user.id
                                            }
                                        })
                                        res.json({
                                            status: true,
                                            message: `Payment ${transaction.message}`,
                                            transaction: savetrnx,
                                        })
                                    }else{
                                        await Adsub.update({
                                            sub_type: savetrnx.sub_type.toLowerCase(),
                                            status: "active",
                                            end_date: savetrnx.end_date
                                        }, {
                                            where:{
                                            
                                                id: ads.id,
                                                userId: req.user.id
                                                                                        
                                            }
                                        })
                                        res.json({
                                            status: true,
                                            message: `Payment ${transaction.message}`,
                                            transaction: savetrnx,
                                        })
                                    }
                                    
                                }else{
                                    const new_ad = new Adsub({
                                        userId: req.user.id,
                                        sub_type: savetrnx.sub_type.toLowerCase(),
                                        status: "active",
                                        end_date: savetrnx.end_date
                                    })
                                    const ads = await new_ad.save();
                                    res.json({
                                        status: true,
                                        message: `Payment ${transaction.message}`,
                                        transaction: savetrnx,
                                        ads: ads
                                    })
                                }
                            
                            }).catch(err => console.error(err))
                        }
                        
                    }
                   
                    }).catch(err => console.error(err))
                }

                }).catch(err => console.error(err))
                
            }else{
                res.json("User not logged in or User not found")
            }
        })
        
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.checkVendorSub = async(req, res, next)=>{
    try {
        await Vendorsub.findOne({
            where:{
                userId: req.user.id
            }
        }).then(async (vendorsub) =>{
            if(vendorsub.status === active){
                if(vendorsub.end_date <= (new Date()).toISOString()){
                    await Vendorsub.update({
                        status: "expire"
                    }, {
                        where:{
                            userId: vendorsub.id
                        }
                    }).then((sub)=>{
                        res.redirect("back")
                    })

                }
                next()
            }else{
                res.json({
                    status: false,
                    message: "You Don't have any active subscription"
                })
            }
        }).catch(err => console.error(err))
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.checkAdsSub = async(req, res, next)=>{
    try {
        await Adsub.findOne({
            where:{
                userId: req.user.id
            }
        }).then(async (vendorsub) =>{
            if(vendorsub.status === active){
                if(vendorsub.end_date <= (new Date()).toISOString()){
                    await Adsub.update({
                        status: "expire"
                    }, {
                        where:{
                            userId: vendorsub.id
                        }
                    }).then((sub)=>{
                        res.redirect("back")
                    })

                }
                next()
            }else{
                res.json({
                    status: false,
                    message: "You Don't have any active subscription"
                })
            }
        }).catch(err => console.error(err))
    } catch (error) {
        console.log(error);
        next(error)
    }
}