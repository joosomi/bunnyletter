import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Nav from '../components/Nav';
import Main from './Main';

import './css/mypage.css';
import axios from 'axios';
import { useEffect } from 'react';

import Letter from '../components/Letter';
import { useLocation, useNavigate } from 'react-router-dom';

const Mypage = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user.data);
  const isLoggingIn = useSelector((state) => state.user.user.isLoggingIn);
  const [listIdx, setListIdx] = useState('send');
  const [letters, setLetters] = useState([]);

  //console.log(user);
  //console.log(useSele ctor((state) => state.user));

  const sendBtnRef = useRef();
  const receiveBtnRef = useRef();

  useEffect(() => {
    if (listIdx === 'send') {
      getSendLetters();
    } else {
      getReceiveLetters();
    }
  }, [listIdx]);

  //onClick - 내가 보낸, 내가 받은
  const getSendLetters = () => {
    axios
      .post(`${process.env.REACT_APP_CLIENT_HOST}/getSendLetters`, {
        sender_nickname: user.user_nickname,
      })
      .then((res) => {
        //console.log(res.data);
        let letterIdx = res.data;
        setLetters([]);
        letterIdx.map((letterIdx) => {
          if (letterIdx.sender_visible === 1) {
            setLetters((letter) => {
              return [...letter, letterIdx];
            });
          }
        });
      });
  };

  const getReceiveLetters = () => {
    console.log();
    axios
      .post(`${process.env.REACT_APP_CLIENT_HOST}/getReceiveLetters`, {
        receiver_nickname: user.user_nickname,
      })
      .then((res) => {
        //console.log(res.data);
        let letterIdx = res.data;
        setLetters([]);
        letterIdx.map((letterIdx) => {
          if (letterIdx.receiver_visible === 1) {
            setLetters((letter) => {
              return [...letter, letterIdx];
            });
          }
        });
      });
  };

  const onClickBtn = (e) => {
    //console.log(sendBtnRef.current.value);
    if (e.target.value === 'send') {
      setListIdx('send');
      sendBtnRef.current.classList.add('active');
      receiveBtnRef.current.classList.remove('active');
    } else {
      setListIdx('receive');
      sendBtnRef.current.classList.remove('active');
      receiveBtnRef.current.classList.add('active');
    }
  };

  //onClick - 회원 탈퇴
  const deleteAccount = () => {
    const confirm = window.confirm(
      '정말로 탈퇴하시겠습니까? 내가 받은 편지와 내가 보낸 편지 모두 사라지게 되며 복구가 불가능합니다.'
    );
    if (confirm === true) {
      axios
        .delete(`${process.env.REACT_APP_CLIENT_HOST}/deleteUser`, {
          data: { user_id: user.user_id },
        })
        .then((res) => {
          sessionStorage.clear();
          alert(res.data);
          window.location.href = '/';
        });
    }
  };
  //console.log(letters);

  //onClick - 정보 수정
  const onClickEdit = () => {
    navigate('/editProfile');
  };

  return (
    <>
      {isLoggingIn ? (
        <>
          <Nav />
          <div className="mypage section">
            <section className="userInfo">
              <h2>{user.user_nickname} 님</h2>
              <button onClick={deleteAccount}>회원탈퇴</button>
              <button onClick={onClickEdit}>정보수정</button>
            </section>
            <div className="btns">
              <button
                onClick={onClickBtn}
                ref={sendBtnRef}
                value="send"
                className="active"
              >
                내가 보낸
              </button>
              <button onClick={onClickBtn} ref={receiveBtnRef} value="receive">
                내가 받은
              </button>
            </div>
            <section className="letters">
              <div className="letterDivs">
                {letters.map((letter) => {
                  if (listIdx === 'send') {
                    return (
                      <Letter
                        key={letter.id}
                        data={letter}
                        hideFunc={getSendLetters}
                      />
                    );
                  } else {
                    return (
                      <Letter
                        key={letter.id}
                        data={letter}
                        hideFunc={getReceiveLetters}
                      />
                    );
                  }
                })}
              </div>
            </section>
          </div>
        </>
      ) : (
        <Main />
      )}
    </>
  );
};

export default Mypage;
