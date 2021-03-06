import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { signIn } from '../../actions';
import { RootState } from '../../reducers';
import server from '../../apis/server';
import { StyleBtnBookmarkSml } from '../atoms/BtnBookmark';
import { StyleBtnWithEventBlueSml } from '../atoms/BtnWithEventBlue';
import { StyledInputProfile } from '../atoms/Inputs';

interface Users {
  id: number | null;
  userName: string;
  email: string;
  userImage: string;
  createdAt: string;
  provider: string;
  admin: number;
}

const MyPageProfile = (): JSX.Element => {
  const state = useSelector((state: RootState) => state.signinReducer);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem('accessToken');
  const [userInfo, setUserInfo] = useState<Users>({
    id: 0,
    userName: '',
    email: '',
    userImage: '',
    createdAt: '',
    provider: '',
    admin: 0,
  });
  const [nameModal, setNameModal] = useState(false);
  const [changedUsername, setChangedUsername] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [change, setChange] = useState(false);

  useEffect(() => {
    const userInfo = state.user;
    setUserInfo(userInfo);

  }, [change]);

  useEffect(() => {
    const userInfo = state.user;
    setUserInfo(userInfo);
  });

  const updateUserInfo = async (newToken: string) => {
    try {
      const user = await server.get('/users/mypage', {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      const { data } = user;
      dispatch(signIn(data));
      localStorage.setItem('accessToken', newToken);
      setChange((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  let uploadingImg = async (e: any) => {
    let imageFile: string | Blob = e.target.files[0];
    let imgName: string = e.target.files[0].name;
    const img = new FormData();
    img.append('img', imageFile, imgName);

    try {
      let uploading = await server.patch('/users/modifyuser', img, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'multipart/form-data',
        },
      });

      alert('???????????? ?????????????????????.');
      updateUserInfo(uploading.data.accessToken);
    } catch (err) {
      console.log(err);
    }
  };

  let submitUserName = async () => {
    if (changedUsername === '') {
      setNameModal(false);
      return;
    }

    try {
      let changeUsername = await server
        .patch(
          '/users/modifyuser',
          { userName: changedUsername },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => res.data)
        .then((data) => updateUserInfo(data.accessToken));

      alert('???????????? ?????????????????????.');
      setNameModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const inputPasswordHandler = (e: any) => {
    let target = e.target.value;
    let type = e.target.dataset.type;

    setPasswords({ ...passwords, [type]: target });
  };

  let submitPassword = async () => {
    if (
      !passwords.password &&
      !passwords.newPassword &&
      !passwords.confirmPassword
    ) {
      setPasswordModal(false);
      return;
    }

    if (
      passwords.newPassword !== passwords.confirmPassword ||
      passwords.newPassword === ''
    ) {
      alert('??? ??????????????? ??????????????????.');
      return;
    }

    try {
      let isCurrentCorrect = await server
        .post(
          '/users/modifypassword',
          {
            password: passwords.password,
            newPassword: passwords.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => res.data)
        .then((data) => updateUserInfo(data.accessToken));

      alert('??????????????? ?????????????????????.');
      setPasswordModal(false);
    } catch (err) {
      console.log(err);
      alert('?????? ??????????????? ?????? ??????????????????.');
    }
  };

  const { userName, email, userImage, createdAt } = userInfo;

  return (
    <div>
      <StyleProfileBox>
        <StyleImage src={userImage} alt="userImage" />
        <StyleLabelClick htmlFor="image_uploads">????????? ??????</StyleLabelClick>
        <HiddenInput
          type="file"
          accept="image/*,.pdf"
          id="image_uploads"
          name="image_uploads"
          onChange={uploadingImg}
        />
      </StyleProfileBox>
      <StyleProfileForm>
        <StyleFormElement>
          <span>?????????: </span>
          <span>{email}</span>
        </StyleFormElement>

        <StyleFormElement>
          <span>?????????: </span>
          <span>{userName}</span>
          <StyleBtnWithEventBlueSml onClick={() => setNameModal((pre) => !pre)}>
            ????????? ????????????
          </StyleBtnWithEventBlueSml>
          {!nameModal ? (
            <StyleEmptyDiv />
          ) : (
            <div>
              <StyledInputProfile
                type="text"
                placeholder="?????? ??? ???????????? ??????????????????."
                onChange={(e) => setChangedUsername(e.target.value)}
              />
              <StyleBtnBookmarkSml onClick={submitUserName}>
                ?????? ??????
              </StyleBtnBookmarkSml>
            </div>
          )}
        </StyleFormElement>

        <StyleFormElement>
          <span>?????????: </span>
          <span>{createdAt.slice(0, 10)}</span>
        </StyleFormElement>

        {userInfo.provider !== 'google' && userInfo.provider !== 'kakao' ? (
          <StyleFormElement>
            <span>???????????? ??????</span>
            <StyleBtnWithEventBlueSml
              onClick={() => setPasswordModal((pre) => !pre)}
            >
              ???????????? ????????????
            </StyleBtnWithEventBlueSml>
            {!passwordModal ? (
              <StyleEmptyDiv />
            ) : (
              <div>
                <StyledInputProfile
                  type="password"
                  data-type="password"
                  placeholder="?????? ???????????? 8??????"
                  onChange={inputPasswordHandler}
                />
                <StyledInputProfile
                  type="password"
                  data-type="newPassword"
                  placeholder="??? ???????????? 8??????"
                  onChange={inputPasswordHandler}
                />
                <StyledInputProfile
                  type="password"
                  data-type="confirmPassword"
                  placeholder="??? ???????????? 8?????? ??????"
                  onChange={inputPasswordHandler}
                />
                <StyleBtnBookmarkSml onClick={submitPassword}>
                  ?????? ??????
                </StyleBtnBookmarkSml>
              </div>
            )}
          </StyleFormElement>
        ) : null}
      </StyleProfileForm>
    </div>
  );
};

export default MyPageProfile;

const StyleProfileBox = styled.div`
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.3rem 5rem;
  font-size: 1.2rem;
`;
const StyleImage = styled.img`
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  border: solid 3px var(--color-secondary);
`;
const StyleLabelClick = styled.label`
  cursor: pointer;
  color: #4e89ae;
  margin-top: 1.6rem;
  margin-left: 3.5rem;
`;
const StyleProfileForm = styled.div`
  font-size: 1.6rem;

  color: #808080;
  border-left: 5px solid #4e89ae;
  padding: 2.3rem 5rem;
  margin-top: 4.5rem;
`;
const StyleFormElement = styled.div`
  margin: 1.8rem 0;
`;
const StyleEmptyDiv = styled.div`
  height: 4.8rem;
`;
const HiddenInput = styled.input`
  display: none;
`;
