// react
import { useDispatch, useSelector, DefaultRootState } from "react-redux";
import React, { useState, useEffect } from "react";
import { Provider } from 'react-redux';
// next
import Link from 'next/link'
import { AppProps } from 'next/app';
import { useRouter } from 'next/router'
// component
import store from '../src/store/createStore';
import { userSlice } from '../src/store/slice/slice';
import { StoreState } from '../src/type/type'
// import { cartFetchByApi } from '../src/api/axios'

// material ui
import theme from './theme'
import { ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline, useRadioGroup } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import { AppBar } from "@material-ui/core";
// material ui icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HistoryIcon from '@material-ui/icons/History';

// axios
import axios from 'axios'

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}

function HistoryApp(props){  
  const whiteMoji = {
    color: "white"
  }
  let newDOM = (<> </>)
  
  if(props.tag === 'img') newDOM = ( <img src={props.context} alt="ロゴ" > </img> )
  if(props.tag === 'button') newDOM = ( <Link href={props.link}><Button style={whiteMoji}>{props.icon}{props.name}</Button></Link> )
  if(props.tag === 'button_img') newDOM = ( <Link href={props.link}><Button style={whiteMoji}><img src={props.context} alt="ロゴ" ></img></Button></Link> )

  return (
    <>
    {newDOM}
    </>
  )
}

export async function getStaticProps() {
  const coffee = await axios.get('http://127.0.0.1:8000/api/coffee/')
  const topping = await axios.get('http://127.0.0.1:8000/api/topping/')
  const coffeeList = coffee.data
  const toppingList = topping.data
  return {
    props: {
      coffeeList,
      toppingList
    }
  }
}

export const Loading: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<Boolean>(false);
  const [toumei, setToumei] = useState<Number>(1);

  const handleStart = url => {
    if (url !== router.pathname) {
      setLoading(true);
    }
  };
  const handleComplete = url => {
    if (url !== router.pathname) {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setToumei(toumei + 1)       
  },[loading])

  useEffect(() => {    
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  const recruitStyle = {
    position: "absolute",
    fontSize: `${150 + toumei}px`,
    color: `rgba(255,0,0,${0.01 * toumei})`
  }  

  return loading && <div style={recruitStyle}>採用</div>;
};

const UserCheck = ({coffeeList, toppingList}) => {
  const dispatch = useDispatch();
  const state = useSelector((state: DefaultRootState) => state.user);
  const [userEmail, setUserEmail] = useState("")
  const Router = useRouter()  
  const handleLink = path => Router.push(path)

  const check = () => {
    console.log(state);    
  }

  const login = () => {
    handleLink('/component/Signup')
  }

  const logout = () => {
    dispatch(userSlice.actions.UPDATE_USER({}))
    dispatch(userSlice.actions.LOGOUT())
  }   

  const userStyle = {
    display: 'inline',
    width: "10%",
    fontSize: "3px"
  }

  const userNameStyle = {
    margin: '1%', 
    fontSize: "6px"
  }

  const whiteMoji = {
    color: "white"
  }

  const statecheck = () => {
    console.log(state);    
  }

  const fetchItem = () => {
    dispatch(userSlice.actions.FETCH_ITEM({Coffee: coffeeList}))
    dispatch(userSlice.actions.FETCH_ITEM({Topping: toppingList}))
  }

  useEffect(() => {
    fetchItem()
  },[]) 

  useEffect(() => {     
    setUserEmail(state.user.email)
  },[state.user])   

  return (
    <>
      {/* <Button onClick={statecheck} >State</Button>       */}
     { state.user.email ?               
                <span style={userStyle}>
                  <span style={userNameStyle}>ユーザー名：{userEmail}</span>
                  <Button onClick={logout} style={whiteMoji}><LockIcon />ログアウト</Button>
                </span>
              :
              <Link href="/component/Login/"><a><Button style={whiteMoji}><LockOpenIcon />ログイン</Button></a></Link>
      }
    </>                
  )
}

const MyApp = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const AppHeader2 = {
    backgroundColor: "#4682b4"
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
      <div className="App">
        {/* <AppBar> */}
          <div style={AppHeader2} >
            <HistoryApp tag='button_img' link='/' context={`/header_logo.png`}  />        
            <UserCheck />
            <Loading />
            <HistoryApp tag='button' link='/component/Cart' icon={<ShoppingCartIcon />} name='カート'/>
            <HistoryApp tag='button' link='/component/OrderHistory' icon={<HistoryIcon />} name='注文履歴'/>           
          </div> 
        {/* </AppBar>                */}
      </div>
      <CssBaseline />
      <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;