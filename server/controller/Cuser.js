const { User, Letter } = require('../model/index');
const bcrypt = require('bcryptjs');

// 회원가입 POST
exports.postJoin = async (req, res) => {
  const enteredId = req.body.id;
  const enteredPassword = req.body.pw;
  const enteredNickName = req.body.nickName;

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const existingID = await User.findOne({
    raw: true,
    where: { user_id: enteredId },
  });

  const exisingNickname = await User.findOne({
    raw: true,
    where: {
      user_nickname: enteredNickName,
    },
  });

  if (existingID) {
    res.send({ check: false, msg: '동일한 아이디가 이미 사용중입니다.' });
  } else {
    if (exisingNickname) {
      res.send({ check: false, msg: '동일한 닉네임이 이미 사용중입니다.' });
    } else {
      req.session.user = {
        id: enteredId,
        pw: enteredPassword,
        nickname: enteredNickName,
      };

      let data = {
        user_id: enteredId,
        user_pw: hashedPassword,
        user_nickname: enteredNickName,
      };

      await User.create(data)
        .then((result) => {
          //console.log(result);
          res.send({
            check: true,
            msg: '회원가입에 성공했습니다!',
            userInfo: data,
          });
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    }
  }
};

// 로그인 POST
exports.postLogin = async (req, res) => {
  const enteredId = req.body.id;
  const enteredPassword = req.body.pw;
  //console.log('reqbody', req.body);
  //const idsave = req.body.idsave;

  let result = await User.findOne({
    raw: true,
    where: { user_id: enteredId },
  });

  if (!result) {
    //console.log('!', result);
    res.send({
      check: false,
      msg: '아이디 또는 비밀번호를 잘못 입력했습니다.',
    });
  } else {
    const samePW = await bcrypt.compare(enteredPassword, result.user_pw);
    if (samePW) {
      req.session.save(function () {
        req.session.user = result;
        res.send({
          check: true,
          msg: '로그인에 성공하셨습니다!',
          userInfo: result,
        });
      });
    } else
      res.send({
        check: false,
        msg: '아이디 또는 비밀번호를 잘못 입력했습니다.',
      });
  }
};

//편지 닉네임 검색 POST
exports.postSearch = async (req, res) => {
  const searchNickName = req.body.searchNickName;

  //console.log(searchNickName);
  let result = await User.findOne({
    raw: true,
    where: { user_nickname: searchNickName },
  });

  if (!result) {
    //console.log('!', result);
    res.send({
      check: false,
      msg: '찾는 정보가 없습니다.',
    });
  } else {
    res.send({
      userInfo: result,
    });
  }
};

// 마이페이지 회원 탈퇴 DELETE
exports.deleteAccount = async (req, res) => {
  //console.log(req.body);

  let result = await User.destroy({
    where: { user_id: req.body.user_id },
  });
  //console.log(result);

  let receiverID = await Letter.destroy({
    where: { receiver_id: req.body.user_id },
  });

  if (result) {
    res.send('회원 탈퇴가 완료되었습니다.');
  }
};

// 편지 이미지 DB 저장 POST
exports.postSaveLetter = async (req, res) => {
  const sender_id = req.body.senderID;
  const receiver_id = req.body.receiverID;
  const img_url = req.body.imgURL;
  const letter_context = req.body.letter_context;
  const sender_nickname = req.body.senderNickname;
  const receiver_nickname = req.body.receiverNickname;
  const date = req.body.date;

  const data = {
    sender_id: sender_id,
    receiver_id: receiver_id,
    img_url: img_url,
    letter_context: letter_context,
    img_base64: img_url,
    sender_nickname: sender_nickname,
    receiver_nickname: receiver_nickname,
    date: date,
  };

  const sameLetter = await Letter.findOne({
    raw: true,
    where: {
      sender_id: sender_id,
      receiver_id: receiver_id,
      letter_context: letter_context,
      sender_visible: 1,
    },
  });

  if (!sameLetter) {
    await Letter.create(data)
      .then((result) => {
        //console.log(result.dataValues);
        if (result) {
          res.send({
            check: true,
            msg: '편지함에 편지를 저장했습니다!',
            imgURL: result.dataValues.img_base64,
            imgId: result.dataValues.id,
          });
        } else res.send({ check: false, msg: '다시 한번 시도해주세요.' });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  } else {
    res.send({
      check: false,
      msg: '이미 편지함에 저장된 편지 내용입니다!',
      imgId: Number(sameLetter.id),
    });
  }
};

//편지 이미지 DB 가져오기
exports.postGetImg = async (req, res) => {
  const img_id = req.body.imgId;

  const letter = await Letter.findOne({
    raw: true,
    where: {
      id: img_id,
    },
  });

  res.send({
    check: true,
    letter: letter,
  });
};

//MYPAGE - 내가 보낸 편지 정보 가져오기
exports.postGetSendLetters = async (req, res) => {
  const mylistLetter = await Letter.findAll({
    raw: true,
    where: {
      sender_nickname: req.body.sender_nickname,
    },
  });

  //console.log(mylistLetter);
  res.send(mylistLetter);
};

//MYPAGE - 내가 받은 편지 정보 가져오기
exports.postGetReceivedLetters = async (req, res) => {
  const mylistLetter = await Letter.findAll({
    raw: true,
    where: {
      receiver_nickname: req.body.receiver_nickname,
    },
  });
  //console.log(mylistLetter);
  res.send(mylistLetter);
};

//MYPAGE/EDIT - 비밀번호 수정하기

exports.fetchProfile = async (req, res) => {
  const userID = req.body.user_id;
  const userNickname = req.body.user_nickname;
  const newPassword = req.body.user_pw;

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  let data = {
    user_id: userID,
    user_pw: hashedPassword,
    user_nickname: userNickname,
  };

  let updateResult = await User.update(data, {
    raw: true,
    where: { user_id: userID },
  });

  // let findUpdateResult = await User.findOne(data, {
  //   raw: true,
  //   where: { user_id: userID },
  // });

  if (updateResult) {
    //console.log('*******************', updateResult);
    res.send(true);
  } else res.send(false);
};

//MYPAGE - 편지 PUT
//1. 보낸 편지 - visible 속성을 ='0'으로 변경
exports.hideSentLetter = async (req, res) => {
  const userID = req.body.user_id;
  const letterContext = req.body.letter_context;

  let data = {
    sender_visible: 0,
  };

  let updateVisibleResult = await Letter.update(data, {
    raw: true,
    where: {
      sender_id: userID,
      letter_context: letterContext,
    },
  });

  //console.log(updateVisibleResult);
  if (updateVisibleResult) {
    //console.log(updateVisibleResult);
    res.send(true);
  } else res.send(false);
};

//2. 받은 편지 - visible 속성을 ='0'으로 변경
exports.hideReceivedLetter = async (req, res) => {
  const userID = req.body.user_id;
  const letterContext = req.body.letter_context;

  let data = {
    receiver_visible: 0,
  };

  let updateVisibleResult = await Letter.update(data, {
    raw: true,
    where: {
      receiver_id: userID,
      letter_context: letterContext,
    },
  });

  if (('*******************', updateVisibleResult)) {
    //console.log(updateVisibleResult);
    res.send(true);
  } else res.send(false);
};
