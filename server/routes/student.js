const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', async (req, res) => {

    const { offset , limit , keyword } = req.query;
    
    let query = '';

    if (offset == null && limit == null ) {
        query = "SELECT * FROM STUDENT";
    } else {
        query = "SELECT * FROM STUDENT WHERE stu_name like '%" + keyword +"%' limit " + limit + " offset " + offset;
    }

    //console.log(query);

    try {


        const [list] = await db.query(query);
        const [cnt]  = await db.query("select count(*) as cnt from STUDENT where  stu_name like '%" + keyword +"%' ");

        res.json({
            message: "호출 성공",
            list: list,
            cnt : cnt[0].cnt
        });

    } catch(err) {
        console.log('에러 발생!');
        res.status(500).send('Server Error');
    }
}) 


router.get('/:stuNo', async (req, res) => {

    const  { stuNo } = req.params;

    // console.log("test",productId);
    try {
        const [list] = await db.query("SELECT * FROM STUDENT WHERE stu_no=?", [stuNo]);

           // console.log(result);
       res.json({
           message: "success",
           list : list  //
       });

   } catch(err) {
       console.log('fail');
       res.status(500).send('Server Error');
   }


})



router.post('/', async (req, res) => {


    //res.body
    let { stuNo, stuName , stuDept , stuGrade } = req.body;
    //console.log( productName, description , price , stock , category);
     try {
         const result = await db.query("INSERT INTO STUDENT(stu_no, stu_name , stu_dept  , stu_grade) VALUES (?,?,?,?)", [stuNo,stuName,stuDept,stuGrade]);

            // console.log(result);
        res.json({
            message: "success",
            result: result  //
        });

    } catch(err) {
        console.log('fail');
        res.status(500).send('Server Error');
    }
}) 

router.delete('/', async (req, res) => {
    //res.body
    let {stuNo} = req.body;

     try {
         const result = await db.query("DELETE FROM STUDENT WHERE stu_no  = ?", [stuNo]);

        res.json({
            message: "success",
            result: result  //
        });

    } catch(err) {
        console.log('fail');
        res.status(500).send('Server Error');
    }
}) 

module.exports = router;