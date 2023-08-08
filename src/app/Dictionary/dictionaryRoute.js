const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const mypage = require('./dictionaryController');

/**
 * Dictionary API
 * /app/dictionary
 */

// 1. 
router.get('/', jwtMiddleware, mypage.getKeywordByIdx);

// 2. 
router.post('/usersearch', jwtMiddleware, mypage.postSearchList);

// 3.
router.post('/searchexercise', mypage.postSearchName);

// 4.
router.get('/exerciseinfo', mypage.getInformationByparts);

// 5.
router.get('/exercisemethod', mypage.getMethodByName);

// 6.
router.get('/exercisechat', mypage.getChattingByName);

// 7.
router.post('/chatting', jwtMiddleware, mypage.postChatting);

// 8.
router.patch('/deleteChatt', jwtMiddleware, mypage.deleteChatt)

module.exports = router;