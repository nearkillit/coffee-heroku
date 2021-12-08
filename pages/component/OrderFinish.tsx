// ts
import * as React from 'react';
import type { VFC } from "react"
import 'react-redux'
import { StoreState } from '../../src/type/type'
import Link from 'next/link'

import { Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Card } from "@material-ui/core";
import { useEffect, useState } from "react";
import { DefaultRootState, useSelector } from "react-redux";

declare module 'react-redux' {
  interface DefaultRootState extends StoreState {}
}

const OrderFinish: VFC = () => {
  const state = useSelector((state: DefaultRootState ) => state)

  const absolute = {
    fontSize: "10px",
    webkitTransform: "scale(0.3)",
    // mozTransform: "scale(0.5)",
    // msTransform: "scale(0.5)",
    // oTransform: "scale(0.5)",
    transform: "scale(0.3)"
  }

    return (
        <div>
          <Grid container alignItems="center" >
             <Grid item xs={8}>
               <Card>
                <h1 style={absolute}>決済が完了しました！</h1>
                <p style={absolute}>この度はご注文ありがとうございます。</p>
                <p style={absolute}>お支払い先は、お送りしたメールに記載してありますのでご確認ください。</p>
                {/* {receiptPDF !== '' && <p><a href={receiptPDF}>領収書を表示</a></p>}                 */}
                  <Link href="/" >
                    <Button
                            variant="contained"
                            color="primary"
                            >
                            <span style={absolute}>トップ画面を表示する</span>
                    </Button>
                  </Link>
                 </Card>
             </Grid>   
          </Grid>
        </div>        
    )
}

export default OrderFinish