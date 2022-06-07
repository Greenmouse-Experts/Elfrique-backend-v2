const Sub = require('../models').vendorsub;
const Subprice = require('../models').subprice
const User = require('../models').adminuser;


exports.Subscribe = async(req, res, next)=>{
    const sub = req.query.sub
    try {
        await Subprice.findOne({
            where:{
                sub_type: sub
            } 

        }).then((subprice) => {
            if(subprice){
                
            }
        })
    } catch (error) {
        
    }
}