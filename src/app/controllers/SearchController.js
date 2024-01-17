const Product=require("../models/Product");
const slugify = require('slugify');
const {mutipleMongooseToObject}=require('../../util/mongoose');

class SearchController {
   
    async index(req, res, next) {
      const keyword= req.query.params;
      console.log(keyword);  // In keyword
     
      if (!keyword)
      {
        return res.status(200).send('Product can not be found') 
      }
      else{
        try {

            const search = await Product.find(
                { name: { $regex: new RegExp('^' + keyword + '.*', 'i') } }
            );//.limit(5).exec();
            console.log('Search results:', search); // In kết quả search

            if (search && search.length > 0) {
                res.render('search', {
                    search: mutipleMongooseToObject(search)
                  });
            } else {
                res.status(200).send('No products found');
              }
            } catch (error) {
            throw new Error(error)
        }
    }
      
    }
  }
  
  
  
  module.exports = new SearchController();
  