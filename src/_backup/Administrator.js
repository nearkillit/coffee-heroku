import { Button } from "@material-ui/core";
// import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

const Administrator = () => {  
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory()
  const handleLink = path => history.push(path)
  
  const [items, setItems] = useState([])
  const [coupons, setCoupons] = useState([])
  const [timesales, setTimesales] = useState([])

  const [Itemid, setItemid] = useState('')
  const [deadline, setDeadline] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [errorDeadline, setErrorDeadline] = useState('')

  const changeItemid = (e) => {      
      setItemid(e.target.value)
  }

  const changeCouponCode = (e) => { 
    console.log(e.target.value);     
    setCouponCode(e.target.value)
}

  const changeDeadline = (e) => {    
    const setYear = e.target.value.substr(0,4) * 1
    const nowYear = new Date().getFullYear()
    if( setYear < nowYear ){
        setErrorDeadline('年　が今より前です')
        return
    }
    const setMonth = e.target.value.substr(5,2) * 1
    const nowMonth = new Date().getMonth() + 1    
    if( setMonth < nowMonth ){
        setErrorDeadline('月　が今より前です')
        return
    }
    const setDate = e.target.value.substr(8,2) * 1
    const nowDate = new Date().getDate()    
    if( setDate < nowDate ){
        setErrorDeadline('日　が今より前です')
        return
    }
    setErrorDeadline('')
    setDeadline(e.target.value)    
  }

  const setTimeSale = () => {
    //　未入力チェック
    let errorSentence = ''
    if(Itemid === ''){ errorSentence += '商品、' }    
    if(couponCode === ''){ errorSentence += '割引金額、' }
    if(deadline === ''){ errorSentence += '期限、' }
    
    if(errorSentence !== ''){
        errorSentence += 'を入力してください'
        alert(errorSentence)
        return
    }

    // 重複チェック
    const douplicateCheck = state.TimeSale.filter( t => t.Itemid === Itemid ).length !== 0
    if(douplicateCheck){
        alert("Id:" + Itemid + " の商品は既にタイムセールス中です")
        return
    }

    const TimeSale = timesales
    TimeSale.push({ deadline, Itemid, couponCode })
    
    firebase.firestore()
    .collection(`Items`)
    .doc('TimeSale')
    .set({ TimeSale })    
    .then( querySnapshot => {
      console.log(querySnapshot);
      dispatch({ type: 'UPDATE_TIMESALE', payload: { TimeSale }})
      alert('タイムセールが更新されました')              
    })
  }

  useEffect(()=>{
    setItems(state.Coffee)           
  },[state.Coffee])

  useEffect(()=>{    
    setCoupons(state.Coupon)
  },[state.Coupon])

  useEffect(()=>{    
    setTimesales(state.TimeSale)    
  },[state.TimeSale])

  useEffect(()=>{
    if(state.user.uid !== "oD7bRul05kcE0Ez2oQfH01PKv073" && state.user.uid !== "zjoltJkfYMMTpJv9zbK7xXTvLdH3"){
      handleLink('/') 
    }
  },[state.user])

  const errorDeadLineStyle = {
      position: "absolute",
      color: "red",
      fontSize: "12px"
  }

    return (
        <div>
          <Grid container alignItems="center" >
             <Grid item xs={8}>
               <Card>
                    <h1>管理者画面</h1>
                    <p>タイムセール商品</p>
                    <select name="items" id="item-select" value={Itemid} onChange={changeItemid}>
                        <option value=''>選択してください</option>        
                        {items.map( c => {
                            return ( <option key={c.id} value={c.id}>{c.name}M:{c.priceM}円、L:{c.priceL}円</option> )
                        })}
                    </select>
                    <p>割引金額</p>
                    <select name="coupon" id="coupn-select" value={couponCode} onChange={changeCouponCode}> 
                        <option value=''>選択してください</option>         
                        {coupons.filter(c => c.code.indexOf("_TIMESALE") > 0 ).map( c => {
                            return ( <option key={c.code} value={c.code}>割引金額:{c.price}円</option> )
                        })}
                    </select>  
                    <p>期限</p>
                    <input type="date" value={deadline} onChange={changeDeadline}></input>
                    <span style={errorDeadLineStyle}>{errorDeadline}</span>
                    <p><Button onClick={setTimeSale}>決定</Button></p>
                </Card>
             </Grid>   
          </Grid>
        </div>        
    )
}

export default Administrator