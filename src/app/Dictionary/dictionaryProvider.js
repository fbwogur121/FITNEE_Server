const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const dictionaryDao = require("./dictionaryDao");


exports.retrieveKeyword = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const keywordCheckResult = await dictionaryDao.selectKeyword(connection, userIdFromJWT);
    connection.release();
  
    return keywordCheckResult;
  };

// 검색키워드 db에 저장
exports.putSearch = async function (search, userIdFromJWT) {
  const connection = await pool.getConnection(async (conn) => conn);
  const keywordPutResult = await dictionaryDao.putKeyword(connection, search, userIdFromJWT);
  connection.release();

  return keywordPutResult;
};


//
exports.retrieveInformation = async function (parts) {
  const connection = await pool.getConnection(async (conn) => conn);
  const exerciseInformationResult = await dictionaryDao.selectInformation(connection, parts);
  connection.release();

  return exerciseInformationResult;
};


//
exports.retrieveMethod = async function (name) {
  const connection = await pool.getConnection(async (conn) => conn);
  const exerciseMethodResult = await dictionaryDao.selectExerciseMethod(connection, name);
  connection.release();

  return exerciseMethodResult;
};

//
exports.retrieveChatting = async function (name) {
  const connection = await pool.getConnection(async (conn) => conn);
  const exerciseChattingResult = await dictionaryDao.selectExerciseChatting(connection, name);
  connection.release();

  return exerciseChattingResult;
};
