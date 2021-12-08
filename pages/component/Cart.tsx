// react
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import * as React from 'react';
import type { VFC } from "react"
import 'react-redux'
// next
import Router from 'next/router'
// component
import { StoreState, CartState, CartItemListState } from '../../src/type/type'
import { userSlice } from '../../src/store/slice/slice';
import { cartDeleteByApi } from '../../src/api/axios'

// material ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// material ui icon
import DeleteIcon from '@material-ui/icons/Delete';
import ShopIcon from '@material-ui/icons/Shop';

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}

const Cart: VFC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: DefaultRootState ) => state.user)
  const [cartItemList, setCartItemList] = useState<Array<CartItemListState>>([])  
  const handleLink = path => Router.push(path)

  const deleteCart = (index) => {
    const newCartItemList = cartItemList.filter((c,i) => i !== index)    
    const delCartItemList = cartItemList.filter((c,i) => i === index)[0]

    // ログインしている場合
    if(state.user.id){
      dispatch(userSlice.actions.UPDATE_CARTITEMLIST(newCartItemList))
      cartDeleteByApi({ cart:{ id: delCartItemList.id }, token: state.user.token })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    }else{
      dispatch(userSlice.actions.UPDATE_CARTITEMLIST(newCartItemList))
      cartDeleteByApi({ cart:{ id: delCartItemList.id }, token: state.user.token })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    }

    setCartItemList(newCartItemList)
  }

  const order = () => {    
    // ログインしている場合
    if(state.user){
      handleLink('/component/OrderConfirm')
    }else{              
      handleLink('/component/OrderConfirm')                       
    }

  }  

  useEffect(()=>{
    console.clear();
    console.table(state)
    console.log('8月')
    console.log('家賃：65000円')
    console.log('光熱費：5000円')
    console.log('食費：30000円');
    console.log('飲み代：8000円');        
    console.log('-------------');
    console.log('9月')
    console.log('家賃：60000円')
    console.log('光熱費：5500円')
    console.log('食費：25000円');
    console.log('飲み代：7400円');    
    console.log('タフマン：600円');
    console.log('※カードきりすぎない！！！');    
  },[])

  useEffect(()=>{    
    let newCartItemList: Array<CartItemListState> = state.cart.cartItemList
    if(newCartItemList){
      // subtotal を追加
      newCartItemList = newCartItemList.map( c => {
        let cc = Object.assign({},c)
        cc.subtotal = ( c.Coffee["coffee_" + c.item_size] + c.Topping.reduce((ac,cu) => ac + cu["topping_" + c.item_size],0)) * c.item_number
        return cc
      })            
      setCartItemList(newCartItemList)
    }            
  },[state.cart])

  const buttonOrder = {
    fontSize: '24px',        
  }

  const totalPrice = {
    color: "white",
    backgroundColor: "rgb(70, 77, 180)"
  }

  const nameFont = {
    fontSize: "18px"
  }

  return (
    <>    
    <h2>カート内容</h2>
    {cartItemList.length !== 0 ?  
    <TableContainer component={Paper}>    
      <Table aria-label="simple table">
        <TableHead className='chumon-head'>
          <TableRow>
            <TableCell>商品名</TableCell>
            <TableCell>サイズ、価格、数量</TableCell>
            <TableCell>トッピング</TableCell>
            <TableCell>合計</TableCell>
            <TableCell>削除</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='chumon'>
         {cartItemList.map((c, index) => {            
            return (
            <TableRow key={index}>
              <TableCell component="th" scope="row">                
                <img src={'/taughman.jpeg'} height="170px" alt="商品" style={{borderRadius:5}}/>                
                <span style={nameFont}>{c.Coffee.coffee_name}</span>
              </TableCell>
              <TableCell>{c.item_size.replace('price','') + 'サイズ'}、{c.Coffee["coffee_" +c.item_size]}円、{c.item_number}個</TableCell>              
              <TableCell>
                <ul>                     
                {c.Topping.map((t,i) => {                  
                  return (
                    <li key={i}>{t.topping_name}、{t["topping_" + c.item_size]}円</li>
                  )
                })}
                </ul> 
              </TableCell>
              <TableCell>{c.subtotal}円</TableCell>
              <TableCell><Button onClick={ () => deleteCart(index)}><DeleteIcon />削除</Button></TableCell>
            </TableRow>)
            })                  
          }
        </TableBody>
      </Table>
      <Typography variant="h6" style={totalPrice}>合計金額：{cartItemList.reduce( (a,c) => c.subtotal + a, 0 )}円</Typography>
      </TableContainer>
      :
      <Typography variant="h3">カートに商品がありません。</Typography>
      }
      <p></p>
    {cartItemList.length !== 0 &&
      <Button style={buttonOrder} onClick={order} className='botan'><ShopIcon />注文に進む</Button>
    }
    </>
  );
}

export default Cart;
