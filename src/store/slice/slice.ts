import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartState, CoffeeState, OrderhistoryState, ToppingState, CartItemListState, ItemState } from '../../type/type'
  
export type userState = {
    Coffee: CoffeeState | [],
    Topping: ToppingState | [],
    user: any,
    cart: CartState,
    orderhistory: OrderhistoryState
}

export const newCart: CartState = {
    addressNumber: '',
    address:'',
    cartItemList:[],
    email:'',
    order_name:'',
    order_date:'',
    order_time:'',
    status:0,
    tel:'', 
  }  

export const initialState: userState = {
    Coffee: [],
    Topping: [],  
    user: {},      
    cart: newCart,
    orderhistory: [],
} 

export const userSlice = createSlice({
    name: 'user',
    initialState,    
    reducers: {
        NEW_CART(state) {
            state.cart = newCart
        },
        UPDATE_CART(state, action: PayloadAction<CartState>) {
            state.cart = action.payload       
        },
        UPDATE_CARTITEMLIST(state, action: PayloadAction<Array<CartItemListState>>){
            state.cart.cartItemList = action.payload
        },        
        UPDATE_USER(state, action: PayloadAction<any>){                      
            state.user = action.payload                        
        },
        ADD_CARTITEMLIST(state, action: PayloadAction<CartItemListState>){            
            state.cart.cartItemList.push(action.payload)            
        },
        ADD_ORDERHISTORY(state, action: PayloadAction<CartState>){
            state.orderhistory.push(action.payload)            
        },
        FETCH_CART(state, action: PayloadAction<CartState>){
            state.cart = action.payload            
        },
        FETCH_CART_ID(state, action: PayloadAction<string>){
            state.cart.id = action.payload            
        },
        FETCH_ITEMDETAIL_ID(state, action: PayloadAction<string>){
            state.user.item_detail_id = action.payload            
        },
        FETCH_ORDERHISTORY(state, action: PayloadAction<OrderhistoryState>){
            state.orderhistory = action.payload            
        },
        FETCH_ITEM(state, action: PayloadAction<any>){                       
            if(action.payload.Coffee) state.Coffee = action.payload.Coffee 
            if(action.payload.Topping) state.Topping = action.payload.Topping
        },
        LOGOUT(state){
            state.user = {}
            state.cart = newCart
            state.orderhistory = []
        }
    },
  })
                