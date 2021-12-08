// ts
import * as React from 'react';
import type { VFC } from "react"
import 'react-redux'
import { StoreState, ToppingState, CartItemListState } from '../type/type'

import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

// components
// import { newCart } from '../store/index'
import { GetItemById, GetDiscountByCoupon } from '../components/Items'
import '../App.css';
// material ui
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import Filter4Icon from '@material-ui/icons/Filter4';
import WarningIcon from '@material-ui/icons/Warning';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ShopIcon from '@material-ui/icons/Shop';

// import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// axios
import axios from 'axios' 
import { sendMail } from '../components/SendMail'

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}

const OrderConfirm: VFC = () => {

  //まとめる　＋カートの情報も　state.cart.cartItemListでとってこれる
  const [name, setName] = useState<string>('ラクス太郎');
  const [email, setEmail] = useState<string>('shun.sakamoto@rakus-partners.co.jp');
  const [addNumber, setAddNumber] = useState<string>('192-0045');
  const [addNumberError, setAddNumberError] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [orderDate, setOrderDate] = useState<string>('');
  const [orderTime, setOrderTime] = useState<string>('');
  const [tel, setTel] = useState<string>('000-0000-0000');
  const [status, setStatus] = useState<string>('');
  const [errors, setErrors] = useState<Array<any>>([]); //エラーの配列

  // const [buyer,setBuyer] =useState({})//注文者情報
  const [cartItemList, setCartItemList] = useState<Array<CartItemListState>>([])

  const [couponCode, setCouponCode] = useState<string>(''); //クーポン
  const [couponCodes, setCouponCodes] = useState<Array<string>>([]); //クーポンs
  const [couponFrag,setCouponFrag] = useState<Boolean>(false) //クーポンが使われたかどうか
  const [couponPrice,setCouponPrice] =useState<string>('') //割引額
  const [Coupons,setCoupons] =useState<Array<any>>([])//クーポンのバリデーション

  //firebase ここから
  const dispatch = useDispatch();
  const state = useSelector((state: DefaultRootState ) => state)
  const history = useHistory()
  const handleLink = (path: string) => history.push(path)

  const allowCoupon=()=>{
    if(!couponFrag){
      for (let i = 0; i < Coupons.length; i++) {
        if (Coupons[i].code === couponCode) {          
          setCouponFrag(true)          
          setCouponPrice(Coupons[i].price)
          setCouponCodes([...couponCodes, couponCode])
          console.log(`クーポンはありました${Coupons[i].price}円の割引です`)
        }
      }
    }
  }

  const getAddress = () => {  
    // console.log(couponCodes.reduce( (a,c) => GetDiscountByCoupon(c, couponCode) + a , 0)) 
    console.log(couponCodes);
    
    if(/^\d{3}-\d{4}$/.test(addNumber)){
      setAddNumberError('')
      axios.get('https://api.zipaddress.net/'
      ,{
        params:{
          zipcode: addNumber
        }}
      ).then(res => {
        if(res.data.code === 404 ){
          setAddNumberError('郵便番号が存在しません')
        }else{
          setAddress(res.data.data.address)
        }
      })
    }else{
      setAddNumberError('郵便番号の指定が合っていません')
      setAddress('error')
    }
  }

  const AddCartFire = (by) => {

    // by = 購入者情報
    const newOrder = Object.assign(by,{ cartItemList: state.cart.cartItemList } )   // coupon追加するならここ           
    // sendMail(newOrder)
    // MakeReceipt(newOrder)

    // // add history
    // firebase.firestore()
    //         .collection(`users/${state.user.uid}/carts`)
    //         .doc(state.cart.uid)
    //         .update(newOrder)
    //         .then( d => {
    //           dispatch({ type:'ADD_ORDERHISTORY', payload:{ uid: state.cart.uid, orderhistory: newOrder }})
    //         })

    // // create cate
    // firebase.firestore()
    //           .collection(`users/${state.user.uid}/carts`)
    //           .add(newCart)
    //           .then( d => {
    //             const newCarts = Object.assign({}, newCart)
    //             newCarts.uid = d.id
    //             newCarts.cartItemList = []
    //             dispatch({ type:'CREATE_CART', payload:{ cart: newCarts }})
    //           })
    handleLink('orderfinish')
  }

  const changeName = (e) => {
    setName(e.target.value);
  };

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const changeAddNumber = (e) => {
    setAddNumber(e.target.value);
  };

  const changeAddress = (e) => {
    setAddress(e.target.value);
  };

  const changeTel = (e) => {
    setTel(e.target.value);
  };

  const changeOrderDate = (e) => {
    setOrderDate(e.target.value);
  };

  const changeOrderTime= (e) => {
    setOrderTime(e.target.value);
  };

  const changeStatus= (e) => {
    setStatus(e.target.value);
  };

  const changeCouponCode = (e) => {
     setCouponCode(e.target.value);
   };
   
  const  validEmail=(email)=>{
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }//メールアドレスのバリデーション

  const validZipaddress=(addNumber)=>{
    let re = /^\d{3}-\d{4}$/
    return re.test(addNumber) //郵便番号の表記のバリデーション
  }

  const  validPhone = (tel) =>{
    let re = /^\d{3}-\d{4}-\d{4}$/
    return re.test(tel) //電話番号の表記のバリデーション
  }

//日付のバリデーション　-始まり-

const validOrderdate=(orderDate)=>{
  //本日
  let today = new Date()
  today = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours()
  )

  let date1 = new Date(orderDate)
  let nowDay = today.getDate()
  let date = new Date (date1)

  let selectedMonth = date1.getMonth() //選択した月
  let nowMonth =today.getMonth()
  let selectedDay = date1.getDate()
  let nowHour = today.getHours()
  let a = Math.abs(Number(orderTime) - nowHour)

    if(nowMonth < selectedMonth){
      console.log(`trueだよ`)
      return true

    }
    else if(nowMonth === selectedMonth){
      console.log(`同じ月です`)
      if(nowDay === selectedDay){
        console.log('同じ日付です')
        if(Number(orderTime) <= nowHour){
           console.log('時間がおかしいです')
          return false
        } else if( 3 <= a) {
        console.log('時間は正常です')
        return true
        } else {
        return false
        }
      }
      //ここまで同じ日の場合の処理
         else if(nowDay > selectedDay){
        console.log('本日以降の日付を選択してください')
        return false
      }else{
        return true
      }
     }
    }


// 日付のバリデーション　-終わり-


  const checkValid = () => {

    //配列をからにする
    setErrors([])
    let allError =[]

    if (!name) {
      allError.push("名前を入力してください")
    }
    if (!email) {
      allError.push("メールアドレスを入力してください")
    } else if(!validEmail(email)){
      allError.push("メールアドレスを正しい形式で入力してください")
    }

    if (!addNumber) {
      allError.push("郵便番号を入力してください")
    } else if(!validZipaddress(addNumber)){
      allError.push("郵便番号は、ハイフンをつけて半角でご入力ください")
    }


    if (!address) {
      allError.push("住所を入力してください")
    }

    if (!orderDate) {
      allError.push("配達日を入力してください")
    } else if(!validOrderdate(orderDate)){
      allError.push("配達日時は今から3時間後以降をご選択ください")
    }

    if (!orderTime) {
      allError.push("配達時間をご選択ください")
    }
    if (!tel) {
      allError.push("電話番号を入力してください")
    } else if(!validPhone(tel)){
      allError.push("電話番号は、ハイフンをつけて半角でご入力ください")
    }


    if (!status) {
      allError.push("支払い方法を選択してください")
    }
    setErrors(allError)

    if (allError.length === 0) {
        let objName = {name:name}
        let objEmail = {email:email}
        let objAddnumber = {addNumber:addNumber}
        let objAddress = {address:address}
        let objOrderDate = {orderDate:orderDate}
        let objOrderTime = {orderTime:orderTime}
        let objTel = {tel:tel}
        let objStatus = {status:status}
        let objcouponCode ={couponCode:couponCodes}

        let BuyerObj =Object.assign({},objName, objEmail, objAddnumber,objAddress,objOrderDate,objOrderTime,objTel,objStatus,objcouponCode);
        // setBuyer(BuyerObj);

        AddCartFire(BuyerObj)
    }
  };

  useEffect(()=>{
    let newCartItemList = state.cart.cartItemList     
    if(newCartItemList){
      // cartのIDを全て商品情報に変換 Item, Topping, subtotal を追加
      // const newCouponCodes = couponCodes.concat()

      newCartItemList = newCartItemList.map( c => {
        c.Coffee = GetItemById(c.Itemid, state.Coffee)
        c.Topping = c.topping_id.map( t => GetItemById(t, state.Topping) )
        c.subtotal = ( c.Coffee[c.price] + c.Topping.reduce((ac,cu) => ac + cu[c.price],0)) * c.item_number
        // if(c.Item.couponCode){          
        //   for(let i = 0; i < Number(c.number); i++ ){
        //     newCouponCodes.push(c.Item.couponCode)
        //   }
        // }
        return c
      })
      // newCouponCodes.length !== 0 && setCouponCodes(newCouponCodes)        
      setCartItemList(newCartItemList)      
    }
    else{
      handleLink('/cart')
    }
  },[state.cart])

  useEffect(()=>{
    setCoupons(state.Coupon)    
  },[state.Coupon])

  useEffect(()=>{
    if(!state.user.uid){
      handleLink('/cart')
    }
  },[state.user])


  const addNumberErrorMes: React.CSSProperties = {
    fontSize: "50%",
    color: "red",
    position: "absolute",
  }

  const totalPrice: React.CSSProperties = {
    color: "white",
    backgroundColor: "rgb(70, 77, 180)"
  }

  return (

    <div>
      <h1><Filter1Icon />&nbsp;注文内容をご確認ください</h1>
      <Table aria-label="simple table">
        <TableHead className='chumon-head'>
          <TableRow>            
            <TableCell>商品名</TableCell>
            <TableCell>サイズ、価格、数量</TableCell>
            <TableCell>トッピング</TableCell>
            <TableCell>合計</TableCell>
          </TableRow>
        </TableHead>
        <TableBody  className='chumon'> 
         {cartItemList.map((c, index) => {
            return (
            <TableRow key={index}>                
              <TableCell component="th" scope="row">                
                <img src={`${window.location.origin}/${c.Coffee.image}`} height="100px" alt="商品" style={{borderRadius:5}}/>
                <span>{c.Coffee.coffee_name}</span>  
              </TableCell>
              <TableCell>{c.price.replace('price','') + 'サイズ'}、{c.Coffee[c.price]}円、{c.item_number}個</TableCell>
              <TableCell>
                <ul>
                {c.Topping.map((t,i) => {
                  return (
                    <li key={i}>{t.topping_name}、{t[c.price]}円</li>
                  )
                })}
                </ul>
              </TableCell>
              <TableCell>{c.subtotal}円</TableCell>
            </TableRow>)
            })
          }
        </TableBody>
      </Table>
      <Typography variant="h6" style={totalPrice}>合計金額：{cartItemList.reduce( (a,c) => c.subtotal + a, 0 )}円</Typography>



    <h1><Filter2Icon />&nbsp;お客さま情報を入力してください</h1>

  <Table>
  	<TableBody>
		<TableRow>
			<TableCell>
          お名前
      </TableCell>
			<TableCell>
         <input type="text" value={name} onChange={changeName} placeholder="ラクラク 太郎"></input>
      </TableCell>
		</TableRow>
		<TableRow>
			<TableCell>
        メールアドレス
      </TableCell>
			<TableCell>
         <input type="text" value={email} onChange={changeEmail} placeholder="rakus@coffee.co.jp"></input>
      </TableCell>
    </TableRow>
    <TableRow>
			<TableCell>
          郵便番号
      </TableCell>
			<TableCell>
         <input type="text" value={addNumber} onChange={changeAddNumber} placeholder="000-0000"></input>
         <Button onClick={getAddress}>郵便番号から住所入力</Button>
         <span style={addNumberErrorMes}>{addNumberError}</span>
      </TableCell>
		</TableRow>
    <TableRow>
    <TableCell>
          住所
      </TableCell>
			<TableCell>
         <input type="text" value={address} onChange={changeAddress}  placeholder="東京都新宿区4-3-25"></input>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
          電話番号
      </TableCell>
			<TableCell>
         <input type="text" value={tel} onChange={changeTel}　placeholder="000-0000-0000"></input>
      </TableCell>
    </TableRow>

    <TableRow>
    <TableCell>
          配達日
        </TableCell>
        <TableCell>
      <input type="date" value={orderDate} onChange={changeOrderDate}></input>
      </TableCell>
      </TableRow>

      <TableRow>
      <TableCell>
          配達時間
        </TableCell>
        <TableCell>
      <select name="pets" id="pet-select" value={orderTime} onChange={changeOrderTime}>
        <option value="">時間を選択してください</option>
        <option value="10">10時</option>
        <option value="11">11時</option>
        <option value="12">12時</option>
        <option value="13">13時</option>
        <option value="14">14時</option>
        <option value="15">15時</option>
        <option value="16">16時</option>
        <option value="17">17時</option>
        <option value="18">18時</option>
        <option value="19">19時</option>
        <option value="20">20時</option>
    </select>
    </TableCell>
		</TableRow>
    </TableBody>
    </Table>
<p></p>
<h1><Filter3Icon />&nbsp;支払い方法を選択してください</h1>
  <div>
        <input type="radio"  name="payment" value="1" onClick={changeStatus} id='daibiki' />
        <label htmlFor='daibiki' className='point'><MonetizationOnIcon />&nbsp;代金引換</label>
        &nbsp;&nbsp;/&nbsp;&nbsp;
        <input type="radio"  name="payment" value="2" onClick={changeStatus} id='cc'/>
          <label htmlFor='cc' className='point'>
            <CreditCardIcon />&nbsp;クレジットカード
          </label>
  </div>
  <p></p>

  <h1><Filter4Icon />クーポンを適用</h1>
  <input type="text" value={couponCode} onChange={changeCouponCode}></input>
  <Button onClick={allowCoupon} style={{backgroundColor: "primary" }}>適用</Button>
  <Typography variant="h6">割引金額:{couponCodes.reduce((a,c) =>          
         Number(GetDiscountByCoupon(c, Coupons)) + a , 0)}円
  </Typography>
  { couponFrag ? (<p className='couponDisp'>適用しました</p>) : (<p></p>)}  
  <Typography variant="h6" style={totalPrice}>合計金額：
      {cartItemList.reduce( (a,c) => c.subtotal + a, 0 ) -  
      couponCodes.reduce((a,c) => Number(GetDiscountByCoupon(c, Coupons)) + a , 0)}円
  </Typography>

  {/* エラー分 */}
  <ul>
        {errors.map((error, index) => (
          <li key={index} id='error'> <WarningIcon />
            {error}
          </li>
        ))}
  </ul>
  
  <Button variant="contained"   style={{ color: "primary", backgroundColor: "teal", height:"55px" }}  onClick={checkValid}><ShopIcon />注文する</Button>

</div>
)
}


export default OrderConfirm
