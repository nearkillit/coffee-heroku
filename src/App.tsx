import './App.css';

// react
import { 
  Switch,
  Route,  
  useHistory
  // useParams,  
} from 'react-router-dom'
import Cart from './views/Cart'
import ItemDetail from './views/ItemDetail'
import ItemView from './views/ItemView'
import OrderConfirm from './views/OrderConfirm'
import OrderFinish from './views/OrderFinish'
import OrderHistory from './views/OrderHistory'
import Administrator from './views/Administrator'
import './store/index'
import { useDispatch, useSelector, DefaultRootState } from "react-redux";
import React, { useState } from "react";

// material ui
import Button from '@material-ui/core/Button';
import { AppBar } from "@material-ui/core";
// material ui icon
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HistoryIcon from '@material-ui/icons/History';
// import CheckIcon from '@material-ui/icons/Check';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

// axios
import axios from 'axios'

function HistoryApp(props){
  const history = useHistory();
  const handleLink = path => history.push(path)
  const whiteMoji = {
    color: "white"
  }
  let newDOM = (<> </>)
  
  if(props.tag === 'img') newDOM = ( <img src={props.context} alt="ロゴ" onClick={() => handleLink(props.link)} > </img> )
  if(props.tag === 'button') newDOM = ( <Button style={whiteMoji} onClick={() => handleLink(props.link)}>{props.icon}{props.name}</Button> )
  if(props.tag === 'button_img') newDOM = ( <Button style={whiteMoji} onClick={() => handleLink(props.link)}><img src={props.context} alt="ロゴ" ></img></Button> )

  return (
    <>
    {newDOM}
    </>
  )
}

function App() {
  const dispatch = useDispatch();
  const state = useSelector((state: DefaultRootState) => state);
  const history = useHistory();
  const handleLink = path => history.push(path)     

  const [ getTS, setGetTS ] = useState(false)

  const check = () => {                    
    console.log(state);       
  }

  const login = () => {
    console.log('login');    
  }

  const logout = () => {
    console.log('logout');    
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

  const imgStyle = {
    display: 'block',
    width: '3%',
    height: '3%',
    marginTop: "0.6%"
  }  
  
  const weatherStyle =  {
    display: "flex",
    width: "25%",
    height: "40%",
  }

  const weatherMarkStyle =  {
    display: "inline",
    width: "30%",      
    fontSize: "7px",    
  }

  const weatherMathStyle =  {
    display: "inline",
    width: "70%",   
    fontSize: "3px",
    textAlign: "left",
    padding: "0px"
  }

  const whiteMoji = {
    color: "white"
  }

  return (
    <div className="App">
      <AppBar>
      <div className='App-header1'>
        <HistoryApp tag='button_img' link='/' context={`${window.location.origin}/header_logo.png`}  />        
      </div>

        <span className='App-header2' >
        { state.user && state.user.displayName ? 
        <>          
          <div style={userStyle}>
            <p>ユーザー名：</p>
            <p style={userNameStyle}>{state.user.displayName}</p>
            </div>  
          <img src={state.user.photoURL} style={imgStyle} alt="ユーザー"/>
          <Button onClick={logout} style={whiteMoji}><LockIcon />ログアウト</Button>                  
        </>          
        :
        <Button onClick={login} style={whiteMoji}><LockOpenIcon />ログイン</Button>
        }          
        {/* <Button onClick={check}>チェック</Button>         */}
        <HistoryApp tag='button' link='/cart' icon={<ShoppingCartIcon />} name='カート'/>
        <HistoryApp tag='button' link='/orderhistory' icon={<HistoryIcon />} name='注文履歴'/>  
        {(state.user.uid === "oD7bRul05kcE0Ez2oQfH01PKv073" || state.user.uid === "zjoltJkfYMMTpJv9zbK7xXTvLdH3" ) && <HistoryApp tag='button' link='/administrator' icon={<SupervisorAccountIcon />} name='※管理者画面'/>}
        </span> 
      </AppBar>               
            <div>                
                <Switch>
                    <Route path='/' exact component={ItemView} />
                    <Route path='/cart' exact component={Cart} />
                    <Route path='/itemdetail/:Item_id' exact component={ItemDetail} />
                    <Route path='/orderconfirm' exact component={OrderConfirm} />
                    <Route path='/orderfinish' exact component={OrderFinish} />
                    <Route path='/orderhistory' exact component={OrderHistory} />  
                    <Route path='/administrator' exact component={Administrator} />                                              
                    <Route>
                        <p>Not found</p>
                    </Route>
                </Switch>
            </div>
    </div>
  );
}

export default App;
