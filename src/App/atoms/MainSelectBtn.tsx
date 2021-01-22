import React,{ useState } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers'; 
import { updateCategory, updateTaste, updatePrice, updateAlcohol } from '../../actions'
import styled from 'styled-components'; 

interface BtnProps {
  type: string;
  buttonList : string[];
}
const StyledButton = styled.button`
  color: black;
  // background-color: #F6F5F5; 
  border: 1px solid #EE6F57; 
  border-radius: 4px; 
  font-size: 12px; 
  padding: 4px 8px;
  outline : none;
  cursor : pointer;
  &:hover{
    color: #F6F5F5; 
    background-color: #EE6F57;
  }
` ;
const ActiveBtn = styled(StyledButton)`
    color: #F6F5F5; 
    background-color: #EE6F57;
`;
const MainSelectBtn = ({ type, buttonList }: BtnProps ): JSX.Element => {
  const state = useSelector((state: RootState) => state.personalTypeReducer.types);
  const dispatch = useDispatch();

  const [isClicked, setIsClicked] = useState('');
  
  let clickHandler = (e : any) : void => {
    let target = e.target.innerText;  // 1만원 이하... 등등
    let type = e.target.dataset.type; // type, price, taste, alcohol
    
    if(isClicked === target){
      setIsClicked('')
    } else {
      setIsClicked(target)
    }

    if(type === 'category') {
      dispatch(updateCategory(target))
    } else if (type === 'price') {
      dispatch(updatePrice(target))
    } else if (type === 'taste') {
      dispatch(updateTaste(target))
    } else if (type === 'alcohol') {
      dispatch(updateAlcohol(target))
    }

    console.log(type)
    console.log(isClicked)
  }
  
  return (
    // <div>
    // { !isClicked? 
    //       <StyledButton data-type={type} onClick={clickHandler}>{text}</StyledButton>
    //       :<ActiveBtn data-type={type} onClick={clickHandler}>{text}</ActiveBtn>
    // }
    // </div>
    <div>
      {buttonList.map((button)=>(
        button === isClicked? 
        <ActiveBtn data-type={type} onClick={clickHandler}>{button}</ActiveBtn> 
        :
        <StyledButton data-type={type} onClick={clickHandler}>{button}</StyledButton>
      ))}
    </div>
  )
}
export default MainSelectBtn; 