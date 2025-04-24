const express = require('express');
const db = require('../db.js');
const router = express.Router();

router.get('/', async (req, res) => {
   
    let {favorite, offset , limit , keyword } = req.query ;

    let query = '';
    let cnt_query = '';

    if ( favorite == 'y') {
        query = "SELECT b.boardNo, b.title , b.cnt , DATE_FORMAT(b.cdatetime, '%Y-%m-%d') as cdatetime , u.userName FROM TBL_BOARD b LEFT JOIN TBL_USER u ON b.userId = u.userId WHERE cnt >= 20 and title like '%"  +  keyword + "%' limit " + limit + " offset " + offset;
        cnt_query = "SELECT count(*) as cnt FROM TBL_BOARD b LEFT JOIN TBL_USER u ON b.userId = u.userId WHERE cnt >= 20"
    } else {
        query = "SELECT b.boardNo, b.title , b.cnt , DATE_FORMAT(b.cdatetime, '%Y-%m-%d') as cdatetime , u.userName FROM TBL_BOARD b LEFT JOIN TBL_USER u ON b.userId = u.userId WHERE title like '%"  +  keyword + "%' limit "  + limit + " offset " + offset;
        cnt_query = "SELECT count(*) as cnt  FROM TBL_BOARD b LEFT JOIN TBL_USER u ON b.userId = u.userId "
    }

    //console.log(query);

    try {


        const [list] = await db.query(query);
        const [cnt] = await db.query(cnt_query);

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


router.get('/:boardNo', async (req, res) => {

    const  { boardNo } = req.params;

    // console.log("test",productId);
    try {
        const [list] = await db.query("SELECT b.* , u.userName FROM tbl_board b LEFT JOIN TBL_USER u ON b.userId = u.userId WHERE boardNo=?", [boardNo]);

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


    let { title, contents , userId } = req.body;

    try {
         const result = await db.query("INSERT INTO tbl_board (boardNo,title,contents,userId,cnt,cdatetime,udatetime) VALUES (null,?,?,?,0,NOW(),NOW())", [title, contents , userId]);

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

router.delete('/:boardNo', async (req, res) => {
    //res.body
    let {boardNo} = req.params;

     try {
         const result = await db.query("DELETE FROM tbl_board WHERE boardNo  = ?", [boardNo]);

        res.json({
            message: "success",
            result: result  //
        });

    } catch(err) {
        console.log('fail');
        res.status(500).send('Server Error');
    }
}) 


router.put('/:boardNo', async (req, res) => {
    //res.body
    let {method , title , contents } = req.body;
    let {boardNo} = req.params;

    let query = '';
     try {
        // const [result] = await db.query(
        //     "UPDATE TBL_PRODUCT SET productName = ?, description = ?, price = ?, stock = ?, category = ? WHERE productId = ?",
        //     [productName, description, price, stock, category, productId]
        // );
        let result = [];

        if (method == 'VIEW') {
            query = 'UPDATE TBL_BOARD SET CNT = CNT + 1 WHERE boardNo = ' + boardNo ; 
            [result] = await db.query(query);
        } else {
            query = 'UPDATE TBL_BOARD SET title = ? , contents = ? , udatetime = NOW() WHERE boardNo = ?' ; 
            [result] = await db.query(query,[title,contents,boardNo]);            
        }
        
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