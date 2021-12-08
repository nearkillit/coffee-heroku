import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import  Link  from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'


import { SignUpState } from '../../src/type/type'
import { signUpByApi } from '../../src/api/axios'
import { userSlice } from '../../src/store/slice/slice';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

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

const Signup = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const Router = useRouter()
  const handleLink = path => Router.push(path)

  const {register,handleSubmit,formState: {errors}} = useForm()
  const onSubmit = async (data: SignUpState) => {
      if(data.password1 !== data.password2){
        alert("入力されたパスワードが異なります")
      } else {
        signUpByApi(data).then((res: any) => {
          console.log(res);                    
          dispatch(userSlice.actions.UPDATE_USER(res.user))
          dispatch(userSlice.actions.FETCH_CART(res.cart))
          handleLink('/')
        }).catch(err => {
          console.log(err);
        })        
      }
  }

  return (
    <>
    <h1>新規登録</h1>
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="会員登録" />
        <CardContent>
          <div>
            <TextField
              fullWidth
              id="username"
              type="email"
              label="Email"
              placeholder="Email"
              margin="normal"
              {...register("email", {required: true, pattern:/^[a-zA-Z0-9-_\.]+@[a-zA-Z0-9-_\.]+$/})}
            />

            <TextField
              fullWidth
              id="password1"
              type="password"
              label="Password(8文字以上)"
              placeholder="Password(8文字以上)"
              margin="normal"
              {...register("password1", {required: true})}
            />
            <TextField
              fullWidth
              id="password2"
              type="password"
              label="Password再入力"
              placeholder="Password再入力"
              margin="normal"
              {...register("password2", {required: true})}
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
            会員登録
          </Button>
        </CardActions>
      </Card>
    </form>
    </>
  );
}

export default Signup;