import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const SignPageBox = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(131, 131, 131, 0.8);
  z-index: 100;

  .singBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 600px;
    background-color: #f8f8f8;
    .singHeader {
      width: 200px;
      margin-top: 50px;
      padding-bottom: 5px;
      border-bottom: ${(props) =>
        props.singUpCheck
          ? "3px solid rgb(255, 82, 82)"
          : "3px solid rgb(82, 192, 255)"};
      text-align: center;
      font-weight: 500;
      transition: 0.3s;
    }
    .singBody {
      text-align: center;
      width: 400px;
      height: ${(props) => (props.singUpCheck ? "400px" : "400px")};
      margin-top: 50px;
      border: 2px solid black;
      transition: 0.3s;

      .singBodyBox {
        margin-top: 50px;
        .nb {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          .n {
            width: 100px;
            text-align: left;
            font-size: 18px;
            font-weight: 500;
          }
          input {
            padding-left: 10px;
            width: 200px;
            height: 30px;
          }
        }
        .signBO {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: ${(props) => (props.singUpCheck ? "80px" : "50px")};
          transition: 0.3s;

          .signB {
            line-height: 25px;
            width: 100px;
            height: 30px;
            color: white;
            background-color: ${(props) =>
              props.singUpCheck ? "rgb(255, 82, 82)" : "rgb(82, 192, 255)"};
            cursor: pointer;
            transition: 0.2s;
            :hover {
              background-color: ${(props) =>
                props.singUpCheck
                  ? "rgba(255, 82, 82, 0.7)"
                  : "rgba(82, 192, 255, 0.7)"};
            }
          }
          .or {
            position: relative;
            margin: 30px 0px;

            ::after {
              position: absolute;
              top: 50%;
              right: -170px;
              content: "";
              width: 150px;
              border-bottom: 2px solid rgba(107, 107, 107, 0.8);
            }
            ::before {
              position: absolute;
              top: 50%;
              left: -170px;
              content: "";
              width: 150px;
              border-bottom: 2px solid rgba(107, 107, 107, 0.8);
            }
          }
        }
      }
    }
  }
`;

const SignPage = () => {
  const [singUpCheck, setSingUpCheck] = useState(false);
  const [userId, setUserId] = useState({
    id: "",
    email: "",
    password: "",
  });

  const signin = () => {
    // 회원 정보 조회
    axios
      .post(
        `https://localhost:3005/로그인 주소`,
        {
          userId: userId.id,
          password: userId.password,
        },
        { "Content-Type": "application/json", withCredentials: true }
      )
      .then((res) => {
        // 조회 결과에 따라 나뉨
        // 1. true일 경우 해당 회원 정보 받아서
        //    리덕스 회원 정보에 저장
        // 2. false일 경우 로그인 실패 메세지
        return axios.get(`https://localhost:3005/회원정보 조회 주소`);
      })
      .catch((err) => alert(err));
  };

  return (
    <SignPageBox singUpCheck={singUpCheck}>
      <div className="singBox">
        <div className="singHeader">{singUpCheck ? "SingUp" : "Singin"}</div>
        <div className="singBody">
          <div className="singBodyBox">
            <div className="emailBox nb">
              <div className="n">Email : </div>
              <input
                type="email"
                placeholder="email을 입력하세요!"
                onChange={(e) =>
                  setUserId({ ...userId, email: e.target.value })
                }
              />
            </div>
            {singUpCheck ? (
              <div className="nickNameBox nb">
                <div className="n">Nick name : </div>
                <input
                  placeholder="비밀번호를 입력하세요!"
                  value={"●".repeat(userId.password.length)}
                  onChange={(e) =>
                    setUserId({ ...userId, password: e.target.value })
                  }
                />
              </div>
            ) : null}
            <div className="passwordBox nb">
              <div className="n">Password : </div>
              <input
                placeholder="비밀번호를 입력하세요!"
                value={"●".repeat(userId.password.length)}
                onChange={(e) =>
                  setUserId({ ...userId, password: e.target.value })
                }
              />
            </div>
            <div className="signBO">
              {singUpCheck ? null : (
                <div className="signB" onClick={() => signin()}>
                  Sign In
                </div>
              )}
              {singUpCheck ? null : <div className="or">or</div>}
              <div
                className="signB"
                onClick={() => {
                  // if (singUpCheck) {
                  //   //회원 가입 요청
                  // } else {
                  //   setSingUpCheck(true)
                  // }
                  setSingUpCheck(!singUpCheck);
                }}
              >
                Sign Up
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignPageBox>
  );
};

export default SignPage;