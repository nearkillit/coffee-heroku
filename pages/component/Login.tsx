import { useForm } from 'react-hook-form'
import  Link  from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { DefaultRootState, useSelector, useDispatch } from 'react-redux';

import { userSlice } from '../../src/store/slice/slice';
import { StoreState, LoginState } from '../../src/type/type'
import { loginByApi, loginUserState } from '../../src/api/axios'
import { GetCoffeeById, GetToppingsById } from '../../src/components/Items'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { useState } from 'react';


type submit = {
    email: string;
    password: string
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#7d94d1',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}


const Login = () => {
  const classes = useStyles();
  const Router = useRouter()
  const handleLink = path => Router.push(path)
  const dispatch = useDispatch()
  const state = useSelector((state: DefaultRootState ) => state.user)

  const {register,handleSubmit} = useForm()
  const onSubmit = (data: submit) => {
    loginByApi(data)
    .then((res: any) => {            

      const orderId = res.order.map(o => o.carts)
      let cartDataOrigin = res.cart.filter(c => !orderId.includes(c.id))
      let orderDataOrigin = res.cart.filter(c => orderId.includes(c.id))
      
      // cart,toppingの情報を変換
      let orderCart = res.ordercart.map(oc => {
        oc.topping_id = res.ordertopping.filter(ot => ot.cart === oc.id)
        oc.topping_id = oc.topping_id.map(ot => ot.topping_id)
        oc.Topping = GetToppingsById(oc.topping_id, state.Topping)
        oc.Coffee = GetCoffeeById(oc.coffee_id, state.Coffee)
        oc.subtotal = (oc.Coffee["coffee_" + oc.item_size] + 
                        oc.Topping.reduce((pre,cur)=> pre+cur["topping_" + oc.item_size],0))
                        * oc.item_number
        return oc
      })      

      // ordercart を注文履歴とカートに仕分けている
      let cartData = cartDataOrigin.map(c => 
        orderCart.filter(oc => oc.carts === c.id)
      )[0]

      let orderData = orderDataOrigin.map(o => {
        o.cartItemList = orderCart.filter(oc => oc.carts === o.id)
        return o
      })            
      
      console.log(cartDataOrigin);
      
      dispatch(userSlice.actions.FETCH_CART_ID(cartDataOrigin[0].id))
      dispatch(userSlice.actions.UPDATE_USER(res.user))
      dispatch(userSlice.actions.FETCH_ORDERHISTORY(orderData))
      dispatch(userSlice.actions.UPDATE_CARTITEMLIST(cartData))
      handleLink('/')
    }).catch(err => {
      console.log(err);      
    })                    
  }

  return (
    <>
    <h1>ログイン</h1>
    <div>会員登録は <Link href="/component/Signup/"><a>こちらから</a></Link></div>
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="ログイン" />
        <CardContent>
          <div>
            <TextField
              fullWidth
              id="username"
              type="email"
              label="Email"
              placeholder="Email"
              margin="normal"
              {...register("email", {required: true})}
            />

            <TextField
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              {...register("password", {required: true})}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.loginBtn}
            type="submit"
           >
            ログイン
          </Button>
        </CardActions>
      </Card>
    </form>
    </>
  );
}

export default Login;