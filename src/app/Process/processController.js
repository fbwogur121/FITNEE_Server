const {logger} = require("../../../config/winston");
const processProvider = require("./processProvider");
const processService = require("./processService")
const processController = require("./processController")
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * 1 API Name : 운동 루틴 조회 API
 * [GET] /app/process
 */
exports.getProcess = async function (req, res) {
    /**
     * Query Parameter : dayOfWeek
     */

    // 날짜 및 아이디
    const { dayOfWeek } = req.query;

    // dayOfWeek 유효성 검증
    if (!['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(dayOfWeek)) {
        return res.status(400).send(response(baseResponse.INVALID_DAY_OF_WEEK, 'Invalid dayOfWeek'));
    }
    
    const userId = req.decoded.userId
    const routine = await processProvider.getRoutineDetails(dayOfWeek, userId);

    return res.send(response(baseResponse.SUCCESS, {
        dayOfWeek: routine.dayOfWeek,
        routineIdx: routine.routineIdx,
        routineDetails: routine.routineDetails,
        totalTime: routine.totalTime,
        totalCalories: routine.totalCalories,
        totalWeight: routine.totalWeight,
    }));
};

/**
 *  2 API Name : 운동 루틴 대체 추천 API
 * [GET] /app/process/replace
 */
exports.getReplacementRecommendations = async function (req, res) {
    /**
     * Query Parameter : healthCateogryIdx, routineIdx
     */
        
    const routineIdx = req.query.routineIdx
    const healthCategoryIdx = req.query.healthCategoryIdx


    // 동일 parts 내에서 랜덤 추출
    const replacementRecommendations = await processProvider.getReplacementExercises(healthCategoryIdx)

    if (replacementRecommendations.length === 0) {
        console.log("No replacement exercises found")
        return res.send(response(baseResponse.REPLACEMENT_EXERCISES_NOT_FOUND))
    }

    return res.send(response(baseResponse.SUCCESS, { replacementRecommendations }))

}


/**
 *  3 API 이름 : 대체된 운동 정보 업데이트 API
 * [Patch] /app/process/replace
 */
exports.patchReplaceExerciseInRoutine = async function (req, res) {
    /**
     * Decoded : userId
     * Query Parameter : routineIdx
     * Body : afterHealthCategoryIdx, beforeHealthCategoryIdx
     */
    
    const routineIdx = req.query.routineIdx
    const beforeHealthCategoryIdx = req.body.beforeHealthCategoryIdx
    const afterHealthCategoryIdx = req.body.afterHealthCategoryIdx
    const userId = req.decoded.userId

    // 1. 회원과 요청된 데이터 검증
    const isValidUser = await processProvider.validateUser(userId, routineIdx);
    if (!isValidUser) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE))
    }

    // routineIdx 에 포함된 heatlthCategoryIdx 검증
    if (!Number.isInteger(parseInt(beforeHealthCategoryIdx)) || parseInt(beforeHealthCategoryIdx) <= 0) {
        return res.send(response(baseResponse.INVALID_ROUTINE_IDX));
    }

    await processProvider.updateHealthCategoryInRoutineDetail(routineIdx, beforeHealthCategoryIdx, afterHealthCategoryIdx, userId)

    return res.send(response(baseResponse.SUCCESS));
};

/**
 * 4 API Name : 운동 건너뛰기 API
 * [PATCH] /app/process
 */
exports.skipExercise = async function (req, res) {
    /**
     * Decoded : userId
     * Query Parameter : routineIdx
     * Body : healthCategoryIdx
     */
    const healthCategoryIdxParam = req.body.healthCategoryIdx
    const routineIdx = req.query.routineIdx
    const userId = req.decoded.userId

    // 1. 회원과 요청된 데이터 검증
    const isValidUser = await processProvider.validateUser(userId, routineIdx);
    if (!isValidUser) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE))
    }


    // 운동 건너뛰기 (skip 값을 1로 업데이트)
    const skipExercise = await processService.updateSkipValue(routineIdx, healthCategoryIdxParam);

    return res.send(response(baseResponse.SUCCESS, skipExercise));
};

/**
 * 5 API Name : myCalendar 추가 API
 * [POST] /app/process/end
 */
exports.postMycalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Query Parameter : routineIdx
     * Body : totalExerciseTime
     */
    // 시간은 초 단위로 받기
    const routineIdx = req.query.routineIdx
    const userId = req.decoded.userId
    const totalExerciseTime = req.body.totalExerciseTime

    // 총 운동 시간 유효성 검증
    if(!totalExerciseTime) {
        return res.send(response(baseResponse.PROCESS_TOTALTIME_INVALID))
    }

    // 추가 정보
    const userIdx = await processProvider.getUserIdx(userId)
    const totalWeight = await processProvider.getTotalWeight(routineIdx)

    const parsedTotalWeight = parseInt(totalWeight[0].totalWeight);

    const totalCalories = await processProvider.getTotalCalories(routineIdx)

    // myCalendar에 데이터 저장
    const postMyCalendar = await processService.postMyCalendar(userIdx, userId, routineIdx, totalExerciseTime, parsedTotalWeight, totalCalories)

    return res.send(response(baseResponse.SUCCESS, postMyCalendar))
}

/**
 * 6 API Name : 결과 조회 API
 * [GET] /app/process/end
 */
exports.getProcessResult = async function (req, res) {
    /**
     * Decoded : userId
     * Query Parameter : dayOfWeek, routineIdx
     */
    const dayOfWeek = req.query.dayOfWeek
    const userId = req.decoded.userId
    const routineIdx = req.query.routineIdx

    // 오늘 날짜 정보 가져오기
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(currentDate.getDate()).padStart(2, '0');

    const todayDate = `${year}-${month}-${day}`;

    // 대체 및 스킵된 데이터 다시 불러오기
    const updateRoutine = await processProvider.getRoutineDetails(dayOfWeek, userId);

    // myCalendar에서 데이터 조회
    const totalData = await processProvider.getTotalData(userId, todayDate)

    // 무게, 시간 차이 조회
    const getComparison = await processProvider.getComparison(userId, routineIdx)

    // 운동 횟수 조회
    const countHealth = await processProvider.getHealthCount(userId)

    return res.send(response(baseResponse.SUCCESS, {
        routineIdx: updateRoutine.routineIdx,
        updateRoutine: updateRoutine.routineDetails,
        totalWeight: totalData.totalWeight,
        totalCalories: totalData.totalCalories,
        totalTime: totalData.totalTime,
        getComparison: getComparison,
        countHealth: countHealth,
    }))
}



// // 관련 운동 추천 아닌가? (보류)
// /**
//  * 9 API Name : 운동 분석 API
//  * [GET] /app/process/:routineIdx/end/detail
//  */
// exports.getProcessEndDetail = async function (req, res) {
//     /**
//      * Decoded : userId
//      */
//     const userId = req.decoded.userId

//     const ProcessEndDetail = await processProvider.retrieveProcessEndDetail(userId)

//     if(!ProcessEndDetail) return res.send(errResponse)
//     else return res.send(baseResponse.SUCCESS, ProcessEndDetail)
// }