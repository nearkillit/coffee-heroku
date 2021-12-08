import React, {useState} from 'react'
import Button from '@material-ui/core/Button';
import SearchSharp from '@material-ui/icons/SearchSharp';
import BackspaceSharpIcon from '@material-ui/icons/BackspaceSharp';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { GetItemById, GetDiscountByCoupon } from '../components/Items'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableFooter } from '@material-ui/core';
import { TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import '../App.css';
import { teal } from "@material-ui/core/colors";
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import { Switch, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
// import RactDom from 'react-dom'
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,      
    },
    imageList: {
      width: "100%",
      height: "100%",
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));

const ItemView =()=>{
    const state = useSelector(state => state)
    const [word, setWord]=useState('')      
    const [search, setSearch] = useState([])        
    const [searhResult, setSearchResult]  = useState('商品を検索できます')
    const [timeSale, setTimeSale] = useState([])
    const [timeSaleItem, setTimeSaleItem] = useState([])
    const getToday = new Date()
    const now = { year: getToday.getFullYear(), month: getToday.getMonth() + 1, day: getToday.getDate(), hours: getToday.getHours()}

    const classes = useStyles();
    const history = useHistory()
    const handleLink = path => history.push(path)

    const type=(e)=>{
        setWord(e.target.value)
    }  
    const Kensaku=()=>{        
        let newSearched = state.Coffee.filter(val2 =>{
            return val2.name.includes(word)
        });

        newSearched.length === 0 ? 
            setSearchResult('検索結果がございませんでした') :
            setSearchResult(newSearched.length + '　件　商品がございます')

        if(word === '' || newSearched.length === 0){
            newSearched = state.Coffee.concat()
        }
                
        setSearch(newSearched)        
    }    

    const Kuria=()=>{
        const word=document.getElementById('box');
        word.value=''
        setWord('')
    }
    
    useEffect(()=>{                 
        setSearch(state.Coffee)                
    },[state.Coffee])

    useEffect(()=>{    
        
        // タイムセール商品のセット
        const newTimeSaleItem = 
        state.TimeSale.map( t => {
            const newItems = GetItemById(t.Itemid, state.Coffee)
            newItems.discount = GetDiscountByCoupon(t.couponCode, state.Coupon)
            newItems.deadline = t.deadline
            return newItems
        })

        setTimeSaleItem(newTimeSaleItem)
    },[state.TimeSale])

    const searchview={
        backgroundColor:'#cef6e5',
        margin:"50px",
        alignSelf: 'flex-end',
        maxWidth: "1000px"
    }
    const Button1 = ({button}) => (
        <button>{button.toUpperCase()}</button>
      );      

    const timeSalePriceBefore = {
        textDecoration: "line-through"
    }

    const timeSalePriceAfter = {
        color: "red"
    }

    return(
    <Paper>
        <nav>
        <TableContainer>
            {timeSaleItem.length !== 0 && (
            <div className={classes.root}>
                 <ImageList rowHeight={240} className={classes.imageList}>
                    <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
                        <ListSubheader component="div">タイムセール商品</ListSubheader>
                    </ImageListItem>
                    { timeSaleItem.map( t => {
                    const getDeadline = new Date(t.deadline)
                    const diffms = getDeadline - getToday
                    const diffDay = Math.floor(diffms/86400000)
                    const diffHour = 24 - getToday.getHours()
                    return (
                    <ImageListItem key={t.id} onClick={()=>handleLink(`/itemdetail/${t.id}`)}>
                        <img src={`${process.env.PUBLIC_URL}/${t.image}`} width="100%" alt="商品" />
                        <ImageListItemBar
                        title={t.deadline.substr(0,4)+ "年" + t.deadline.substr(5,2) + "月" + t.deadline.substr(8,2) + "日"　+ "まで"}
                        subtitle={<p style={timeSalePriceAfter}>あと{diffDay}日{diffHour}時間</p>}
                        position="top" />
                        <ImageListItemBar
                            title={t.name}
                            subtitle={
                                    <>
                                    <div><span style={timeSalePriceBefore}>【M】{t.priceM}円(税抜)</span><span style={timeSalePriceAfter}>【M】{t.priceM - t.discount}円(税抜)</span></div>
                                    <div><span style={timeSalePriceBefore}>【L】{t.priceL}円(税抜)</span><span style={timeSalePriceAfter}>【L】{t.priceL - t.discount}円(税抜)</span></div>
                                    </>}
                            actionIcon={
                                <IconButton aria-label={`info about ${t.name}`} className={classes.icon}>
                                    <InfoIcon />
                                </IconButton>
                            }
                            />
                    </ImageListItem>
                    )
                    })}
                </ImageList>
            </div>)}            
            <Table stickyHeader aria-label="sticky table" options={{
                    paging: false,                    
                    headerStyle: { position: 'sticky', top: 0 },
                }}>
                <TableHead>
{/* 検索 */}
                    <TableRow>
                        <TableCell style={searchview}>
                            <p>商品名　
                                <input type='search' value={word} onChange={type} id="box" maxLength="15" />
                            </p>
                        　　　　
                            <Button type='reset' onClick={Kuria}　style={{ color: "#e0f2f1", backgroundColor: "teal" }}>クリア</Button>&nbsp;
                            <Button style={{ color: "#e0f2f1", backgroundColor: "teal" }} variant="contained" type='submit' onClick={Kensaku} >検索<SearchSharp /></Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
{/* 一覧 */}
                <TableBody>
                    <TableRow>
                    <TableCell>
                    <div className={classes.root}>
                        {Button1}
                        <ImageList rowHeight={240} className={classes.imageList}>
                            <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
                                <ListSubheader component="div">{searhResult}</ListSubheader>
                            </ImageListItem>
                            {search.map((val3,index)=>{
                                return(
                                    <ImageListItem key={index} onClick={()=>handleLink(`/itemdetail/${val3.id}`)}>
                                        <img src={`${process.env.PUBLIC_URL}/${val3.image}`} width="100%" alt="商品" />
                                        <ImageListItemBar
                                            title={val3.name}
                                            subtitle={
                                                val3.discount ? (
                                                <>
                                                  <div><span style={timeSalePriceBefore}>【M】{val3.priceM}円(税抜)</span><span style={timeSalePriceAfter}>【M】{val3.priceM - val3.discount}円(税抜)</span></div>
                                                  <div><span style={timeSalePriceBefore}>【L】{val3.priceL}円(税抜)</span><span style={timeSalePriceAfter}>【L】{val3.priceL - val3.discount}円(税抜)</span></div>
                                                </>
                                                ):(
                                                <>                                                
                                                  <div><span>【M】{val3.priceM}円(税抜)</span></div>
                                                  <div><span>【L】{val3.priceL}円(税抜)</span></div>
                                                </>
                                                )}
                                            actionIcon={
                                                <IconButton aria-label={`info about ${val3.name}`} className={classes.icon}>
                                                    <InfoIcon />
                                                </IconButton>
                                            }
                                        />
                                    </ImageListItem>                                                                                
                                )
                            })}
                        </ImageList>
                    </div>
                    </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </nav>
    </Paper>
    )}


export default ItemView