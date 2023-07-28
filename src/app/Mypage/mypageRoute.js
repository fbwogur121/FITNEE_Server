module.exports = function(app){
    const mypage = require('./mypageController');

    // 1. 
    app.get('/app/mypage', mypage.getExercisedData);

    // 2. 
    app.get('/app/mypageExercise', mypage.getExerciseInfo);

    // 3. 
    app.get('/app/routine', mypage.getExerciseRecord);

    // 4. 유저 정보 조회(
    app.get('/app/routine', mypage.getUserData);

    // 5. 유저 정보 업데이트(
    app.patch('/app/routine', mypage.updateUserData);

    // 6. 비밀번호 수정
    app.patch('/app/routine', mypage.updatePassword);

    // 7. user테이블에 동일 닉네임 존재하는지 확인
    app.delete('/app/routine', mypage.checkUserNameValid);
    
};