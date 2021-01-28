import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../reducers';
import { updateTypes } from '../../actions';
import MainSelectBtn from '../atoms/MainSelectBtn';
import styled from 'styled-components';

const StyleTagContainer = styled.div`
  margin-top: 1.5rem;
`;

const StyleSelectText = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  color: #58595b;
  margin-bottom: 5rem;
`;

type Props = {
  title: string;
  buttonList: string[];
  type: string;
};
const TagWithBtn = ({ title, buttonList, type }: Props): JSX.Element => {
  const state = useSelector((state: any) => state.personalTypeReducer.types);
  const dispatch = useDispatch();

  let clickHandler = (e: any): void => {
    let target = e.target.innerText; // 1만원 이하... 등등

    if (state[type] === target) {
      dispatch(updateTypes(type, ''));
    } else {
      dispatch(updateTypes(type, target));
    }
  };

  return (
    <StyleTagContainer>
      <StyleSelectText>{title}</StyleSelectText>
      <MainSelectBtn
        type={type}
        buttonList={buttonList}
        clickHandler={clickHandler}
      />
    </StyleTagContainer>
  );
};

export default TagWithBtn;
