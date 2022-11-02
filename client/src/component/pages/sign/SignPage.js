import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { check, filtering, info } from "../../../store/slice";
import { registerUser, loginUser, registerInfo } from "../../../api/sign";

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

  .signBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 600px;
    background-color: #f8f8f8;
    .signHeader {
      width: 200px;
      margin-top: 50px;
      padding-bottom: 5px;
      border-bottom: ${(props) =>
        props.signUpCheck
          ? "3px solid rgb(255, 82, 82)"
          : "3px solid rgb(82, 192, 255)"};
      text-align: center;
      font-weight: 500;
      transition: 0.3s;
    }
    .signBody {
      text-align: center;
      width: 400px;
      height: ${(props) => (props.signUpCheck ? "400px" : "400px")};
      margin-top: 50px;
      border: 2px solid black;
      transition: 0.3s;

      .signBodyBox {
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
          margin-top: ${(props) => (props.signUpCheck ? "80px" : "50px")};
          transition: 0.3s;

          .signB {
            line-height: 25px;
            width: 100px;
            height: 30px;
            color: white;
            background-color: ${(props) =>
              props.signUpCheck ? "rgb(255, 82, 82)" : "rgb(82, 192, 255)"};
            cursor: pointer;
            transition: 0.2s;
            :hover {
              background-color: ${(props) =>
                props.signUpCheck
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

const SignPage = ({ control }) => {
  const [signUpCheck, setSignUpCheck] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    address: "",
    nickname: "",
    password: "",
  });
  const dispatch = useDispatch();

  const signin = async () => {
    try {
      dispatch(check({ type: "loading" }));

      const userData = {
        email: userInfo.email,
        password: userInfo.password,
      };

      const { data } = await loginUser(userData);
      console.log(data);
      if (data.status) {
        const userInfoData = await registerInfo();
        const { address, nickname, email, profileurl } =
          userInfoData.data.loginData;

        // dispatch(filtering({ list: res.data.postList }));
        localStorage.setItem(
          "userData",
          JSON.stringify({
            nickname,
            email,
            profileImg: profileurl,
            address,
            tokenBalance: userInfoData.data.ethBalance,
          })
        );
        window.location.href = "/";
        dispatch(check({ type: "" }));
      } else {
        alert("로그인 실패!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async () => {
    const userData = {
      email: userInfo.email,
      nickname: userInfo.nickname,
      password: userInfo.password,
      address: userInfo.address,
    };

    const { data } = await registerUser(userData);
    console.log("회원가입 정보: ", data);

    dispatch(check({ type: "loading" }));
    axios
      .post(
        `http://localhost:3005/users/signup`,
        {
          email: userInfo.email,
          nickname: userInfo.nickname,
          password: userInfo.password,
          address: userInfo.address,
        },
        { "Content-Type": "application/json", withCredentials: true }
      )
      .then((res) => {
        dispatch(check({ type: "" }));
        console.log(res);
      })
      .catch((err) => {
        dispatch(check({ type: "" }));
        alert(err);
      });
  };

  useEffect(() => {
    setSignUpCheck(control === "login" ? false : true);
  }, [control]);

  return (
    <SignPageBox
      signUpCheck={signUpCheck}
      onClick={(e) => {
        dispatch(check({ type: "" }));
      }}
    >
      <div
        className="signBox"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="signHeader">{signUpCheck ? "signUp" : "signin"}</div>
        <div className="signBody">
          <div className="signBodyBox">
            <div className="emailBox nb">
              <div className="n">Email : </div>
              <input
                type="email"
                placeholder="email을 입력하세요!"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>
            {signUpCheck ? (
              <div className="nickNameBox nb">
                <div className="n">Nick name : </div>
                <input
                  placeholder="별명을 입력하세요!"
                  value={userInfo.nickname}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, nickname: e.target.value })
                  }
                />
              </div>
            ) : null}
            <div className="passwordBox nb">
              <div className="n">Password : </div>
              <input
                type={"password"}
                placeholder="비밀번호를 입력하세요!"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
              />
            </div>
            {signUpCheck ? (
              <div className="passwordBox nb">
                <div className="n">address : </div>
                <input
                  placeholder="주소를 입력하세요!"
                  value={userInfo.address}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, address: e.target.value })
                  }
                />
              </div>
            ) : null}

            <div className="signBO">
              {signUpCheck ? null : (
                <div className="signB" onClick={() => signin()}>
                  Sign In
                </div>
              )}
              {signUpCheck ? null : <div className="or">or</div>}
              <div
                className="signB"
                onClick={() => {
                  if (signUpCheck) {
                    //회원 가입 요청
                    signup();
                    setUserInfo({
                      email: "",
                      address: "",
                      nickname: "",
                      password: "",
                    });
                    setSignUpCheck(false);
                  } else {
                    setUserInfo({
                      email: "",
                      address: "",
                      nickname: "",
                      password: "",
                    });
                    setSignUpCheck(true);
                  }
                }}
              >
                {signUpCheck ? "Sign Up" : "Go Sign Up"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SignPageBox>
  );
};

export default SignPage;
