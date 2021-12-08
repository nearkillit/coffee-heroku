// ts
import * as React from 'react';
import type { VFC } from "react"
import 'react-redux'
import { StoreState } from '../../src/type/type'

import { DefaultRootState, useSelector } from "react-redux";
import { useState, useEffect } from "react";

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
  const state = useSelector((state: DefaultRootState ) => state.user)
  const [order, setOrder] = useState<Array<any>>([])

  useEffect(()=>{
      setOrder(state.orderhistory)            
  },[state.orderhistory])

  return (
    <div>
      <p></p>
      <h2>過去のご注文履歴</h2>
    <TableContainer component={Paper}>
    {state.user ? 
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
                  <img src={c.Coffee.img} height="100px" alt="商品" style={{borderRadius:5}}/>
                  {c.Coffee.coffee_name}
                </TableCell>
                <TableCell>{c.item_size.replace('price','') + 'サイズ'}、{c.Coffee["coffee_" + c.item_size]}円、{c.item_number}個</TableCell>              
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
              <TableCell className="chumon-1" colSpan={4}>総額</TableCell>
            </TableRow>
          </TableHead>
          <TableHead className='chumon-total'>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell>       
                {<span>総額:{o.cartItemList.reduce( (a,c) => c.subtotal + a, 0 )}円</span>}
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