import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useSelector } from "react-redux";
// test
import { MakeReceipt } from '../components/MakeRecipt'

const OrderFinish = () => {
  const [ receiptPDF, setReceiptPDF ] = useState('')
  const state = useSelector(state => state);
  const history = useHistory()
  const handleLink = path => history.push(path)
  
  useEffect(()=>{
    const buyUser = state.orderhistory[state.orderhistory.length - 1 ]
    console.log(buyUser);
    MakeReceipt(buyUser).then( res =>{      
      setReceiptPDF(res) 
    }).catch( err =>
      console.log(err)
    )           
  },[state.orderhistory])

  useEffect(()=>{
    if(!state.user.uid){
      handleLink('/') 
    }
  },[state.user])

    return (
        <div>
          <Grid container alignItems="center" >
             <Grid item xs={8}>
               <Card>
                <h1>決済が完了しました！</h1>
                <p>この度はご注文ありがとうございます。</p>
                <p>お支払い先は、お送りしたメールに記載してありますのでご確認ください。</p>
                {receiptPDF !== '' && <p><a href={receiptPDF}>領収書を表示</a></p>}                
                    <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/"
                            >
                            トップ画面を表示する
                    </Button>
                 </Card>
             </Grid>   
          </Grid>
        </div>        
    )
}

export default OrderFinish