// react
import * as React from 'react';
import type { VFC } from "react"
import 'react-redux'
// next
import { useRouter } from "next/router";
import Router from 'next/router'
// component
import { CoffeeState, ToppingState, StoreState, UserDataState } from '../../../src/type/type'
import { userSlice } from '../../../src/store/slice/slice';
import { cartUpdateByApi } from '../../../src/api/axios'


import axios from 'axios'

// material ui
import Button from '@material-ui/core/Button' 
import Card from '@material-ui/core/Card';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import { useState, useEffect } from 'react';
import { DefaultRootState, useDispatch, useSelector } from "react-redux"
import { GetCoffeeById, GetToppingById, GetToppingsById } from '../../../src/components/Items'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

declare module 'react-redux' {
    interface DefaultRootState extends StoreState {}
}

// export async function getStaticProps() {

//     const coffee = await axios.get('http://127.0.0.1:8000/api/coffee/')
//     const topping = await axios.get('http://127.0.0.1:8000/api/topping/')
//     const coffeeList = coffee.data
//     const toppingList = topping.data
//     return {
//       props: {
//         coffeeList,
//         toppingList
//       }
//     }
// }

const ItemDetail: VFC = () =>{
    const Router = useRouter();    
    const state = useSelector((state: DefaultRootState ) => state.user)
    const dispatch = useDispatch()
    const handleLink = path => Router.push(path)

    const [Item_id, setItem_id] = useState<string>(Router.query.id)
    const [dispTopping, setDispTopping] = useState<Array<ToppingState>>([])
    const [selectCoffee, setSelectCoffee] = useState<CoffeeState>({})
    const [getUser, setGetUser] = useState<UserDataState>({})
    let [choiceTopping, setChoiceTopping] = useState<Array<string>>([])
    let [sizeChoice, setSizeChoice] = useState<string>("")
    let [quantityChoise, setQuantityChoise] = useState<string>("")
    let [sizeFinal, setSizeFinal] = useState<string>("")
    let [puantityFinal, setQuantityFinal] = useState<string>("")


    const setTopping = (e) => {
        const getId = e.target.value
    
        if(choiceTopping.includes(getId)){
            setChoiceTopping(choiceTopping.filter(item => item !== getId));
        } else {
            setChoiceTopping([...choiceTopping, getId]);
        }
    }
    
    let totalPrice = ()  => {
        let total = 0
        if(sizeChoice === "M"){            
            return  choiceTopping.length * 200 * Number(quantityChoise) + selectCoffee.coffee_priceM * Number(quantityChoise)
        }else if(sizeChoice === "L"){
            return  choiceTopping.length * 300 * Number(quantityChoise) + selectCoffee.coffee_priceL * Number(quantityChoise) 
        }
        return total
    }
    
    let setQuantity = (e) => setQuantityChoise(e.target.value) 
    // let allSelects = {}
    let sizePrice = ""
    
    const checkValid = ()  => {
        setSizeFinal("")
        setQuantityFinal("")
        let errorSentence = ""

        if (quantityChoise==="" || quantityChoise==="-------------------------------") {       
           setQuantityFinal("個数を選択してください")
           errorSentence += "個数 "
        }
        if(errorSentence !== ""){
            alert(errorSentence + "を入力してください")
        }else{
            if(sizeChoice === "M"){
                sizePrice= "priceM"
            }else if(sizeChoice === "L"){
                sizePrice= "priceL"
            }            

            let allSelects = {  Itemid: selectCoffee.id, 
                                item_number: Number(quantityChoise),
                                item_size : sizePrice,
                                subtotal: totalPrice(),
                                topping_id: choiceTopping, 
                                Coffee: selectCoffee,
                                Topping: GetToppingsById(choiceTopping, state.Topping),
                                id: ''
                              }     
            
            // ログインしていた場合はFirebase、storeを更新            
                const updCart = { item_number: allSelects.item_number, 
                                  coffee_id: allSelects.Itemid,
                                  item_size: allSelects.item_size,
                                  carts: state.cart.id
                                }
                const updCartTopping = allSelects.topping_id.map(t =>
                                        { return { topping_id: t,
                                                   cart: "" 
                                        }} )
                cartUpdateByApi({ cart: updCart, 
                                  topping: updCartTopping, 
                                  token: state.user.token})
                .then((res: any) => {
                    allSelects.id = res.cart.data.id           
                    dispatch(userSlice.actions.ADD_CARTITEMLIST(allSelects))    
                })            
            handleLink('/component/Cart')
        }                
    }
    
    const mainview = {
        display:"flex"
    }

    const itemdetail = {
        display: "block",
        width: "100%",
        // textAlign: "center"
    }

    useEffect(() => {        
        setSelectCoffee(GetCoffeeById(Item_id, state.Coffee))
    },[state.Coffee])

    useEffect(() => {        
        setDispTopping(state.Topping)
    },[state.Topping])

    useEffect(() => {
        setGetUser(state.user)
    },[state.user])

    useEffect(() => {
        if(!Router.query.id){            
            setItem_id(state.user.item_detail_id)
            setSelectCoffee(GetCoffeeById(state.user.item_detail_id, state.Coffee))
        }
    },[state.user.item_detail_id])

    // item_detail idのセット
    useEffect(()=>{
        if(Router.query.id){
            setItem_id(Router.query.id)
            dispatch(userSlice.actions.FETCH_ITEMDETAIL_ID(Router.query.id))
        }              
    },[])

    return (
        <Card style={mainview}>
            {selectCoffee && selectCoffee.coffee_name &&
            <div style={itemdetail}>
            <h1>{selectCoffee.coffee_name} </h1>
            <p>{selectCoffee.coffee_detail}</p>
         
            <img src={`${selectCoffee.img}`}  height="400px" alt="商品" style={{borderRadius:10}}/>
            <h3 style={{backgroundColor:"rgb(70, 77, 180)"}}>合計金額：{totalPrice()}円(税抜)</h3>                      
            <p id='error'> {sizeFinal}</p>
            <p>
               <span>サイズの選択：　</span>
               <input type="radio" name="size" id='M' onClick={() => setSizeChoice("M")} value="M" /><label htmlFor='M' className='point'>
               <span><LocalCafeIcon fontSize='small'/>&nbsp;M&nbsp;&nbsp;{selectCoffee.coffee_priceM}円(税抜)</span></label>
               &nbsp;&nbsp;/&nbsp;&nbsp;
               <input type="radio" name="size" id='L' onClick={() => setSizeChoice("L")} value="L" /><label htmlFor='L' className='point'>
               <span><LocalCafeIcon />&nbsp;L&nbsp;&nbsp;{selectCoffee.coffee_priceL}円(税抜)</span></label>
            </p>

            <div>
            <div id='error'> {puantityFinal}</div>  
            <span>個数の選択：　　　　</span>
    
                <select onChange={setQuantity}>
                    <option >-------------------------------</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
            </div>
            <div>
                <span>トッピングの選択：</span>
                <span style={{textAlign:'right', fontSize:'5px'}}>１つにつきMサイズ：200円・Lサイズ：300円</span>
                    {dispTopping.map((row,index) => (
                        <ul style={{listStyle:'none', }} key={index}>
                        <li className='toppingNarabi'>                                                       
                            <input id={"tid" + index} type="checkbox" value={row.id} onChange={setTopping} checked={choiceTopping.includes(row.id)}/>
                            <label htmlFor={"tid" + index}>{GetToppingById(row.id, dispTopping).topping_name}</label>                            
                        </li>
                        </ul>
                        ))
                    }
            </div>


            <p></p>

                <p></p>                                          
                <Button variant="contained" onClick={checkValid} style={{ color: "#e0f2f1", backgroundColor: "teal", height:"55px" }}><ShoppingCartIcon />カートに追加</Button>             
            </div>}
        </Card>
    )
}
export default ItemDetail