// ts
import * as React from 'react';
import type { VFC } from "react"
import 'react-redux'
import { StoreState } from '../type/type'

import { DefaultRootState, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { GetItemById, GetDiscountByCoupon } from '../components/Items'

// material ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}

const OrderHistory: VFC = () => {
  const state = useSelector((state: DefaultRootState ) => state)
  const [order, setOrder] = useState<Array<any>>([])
  const [couponCode, setCouponCode] = useState<string>(''); //クーポンコード
  const [couponPrice,setCouponPrice] = useState<string>('') //割引額
  const [Coupons,setCoupons] = useState<Array<any>>([])//クーポン

  const allowCoupon=()=>{
    for (let i = 0; i < Coupons.length; i++) {
      if (Coupons[i].code === couponCode) {
          let coupon = Coupons[i].price
      }
    }
  }

  useEffect(()=>{    
    let getOrder = state.orderhistory   
    let Coupons = state.Coupon
 
    if( state.orderhistory && state.orderhistory.length !== 0){
      // cartのIDを全て商品情報に変換 Item, Topping, subtotal を追加
      getOrder = state.orderhistory.map( o => { 
        o.cartItemList = o.cartItemList.map(c => {            
            c.Coffee = GetItemById(c.Itemid, state.Coffee)
            c.Topping = c.topping_id.map( t => GetItemById(t, state.Topping) )
            c.subtotal = ( c.Coffee[c.price] +  ( c.Topping.length !==0 && c.Topping.reduce((ac,cu) => ac + cu[c.price],0))) * c.item_number
            return c
        })
        // o.couponPrice = (Coupons && o.couponCode) ? o.couponCode.reduce((a,c) => GetDiscountByCoupon(c,Coupons) + a,0) : 0   
        return o        
      })      
      setOrder(getOrder)
      setCoupons(Coupons)
    }            
  },[state])  

  return (
    <div>
      <p></p>
      <h2>過去のご注文履歴</h2>
    <TableContainer component={Paper}>
    {state.user.uid ? 
      order.length !== 0 ? 
        order.map((o,i) => (
        <Table key={i} aria-label="simple table">
          <TableHead className='chumon-head'>
            <TableRow>
              <TableCell>商品名</TableCell>
              <TableCell>サイズ、価格、数量</TableCell>
              <TableCell>トッピング</TableCell>
              <TableCell>小計</TableCell>              
            </TableRow>
          </TableHead>
          <TableBody className='chumon'>
          {o.cartItemList.map((c, index) => {            
              return (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <img src={`${window.location.origin}/${c.Item.image}`} height="100px" alt="商品" style={{borderRadius:5}}/>
                  {c.Item.name}
                </TableCell>
                <TableCell>{c.price.replace('price','') + 'サイズ'}、{c.Item[c.price]}円、{c.number}個</TableCell>              
                <TableCell>
                  <ul>                     
                  {c.Topping.map((t,i) => {                  
                    return (
                      <li key={i}>{t.name}、{t[c.price]}円</li>
                    )
                  })}
                  </ul> 
                </TableCell>
                <TableCell>{c.subtotal}円</TableCell> 
              </TableRow>)
              })         
            }
          </TableBody>
          <TableHead className='chumon-head'>
            <TableRow>
              <TableCell className="chumon-1" colSpan={4}>合計</TableCell>
            </TableRow>
          </TableHead>
          <TableHead className='chumon-total'>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell>合計金額:{o.cartItemList.reduce( (a,c) => c.subtotal + a, 0 )}円</TableCell>                
            </TableRow>
          </TableHead>
          <TableHead className='chumon-head'>
            <TableRow>
              <TableCell className="chumon-1" colSpan={4}>割引</TableCell>
            </TableRow>
          </TableHead>

          <TableHead className='chumon-total'>
            <TableRow>
              <TableCell  colSpan={3}></TableCell>
              <TableCell>割引額 - {o.couponPrice}円</TableCell>  
            </TableRow>
          </TableHead>
          <TableHead className='chumon-head'>
            <TableRow>
              <TableCell className="chumon-1" colSpan={4}>総額</TableCell>
            </TableRow>
          </TableHead>
          <TableHead className='chumon-total'>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell>       
                {o.couponPrice ? <span>総額:{o.cartItemList.reduce( (a,c) => c.subtotal + a, 0 ) - o.couponPrice}円</span> : <span>総額:{o.cartItemList.reduce( (a,c) => c.subtotal + a, 0 )}円</span>}
                </TableCell>  
            </TableRow>
          </TableHead>
          
        </Table>
        ))
        :
        <Typography variant="h3">注文履歴がありません</Typography>
      :
      <Typography variant="h3">ログインしてください</Typography>
    }     
    </TableContainer>     
    </div>
  );
}

export default OrderHistory;