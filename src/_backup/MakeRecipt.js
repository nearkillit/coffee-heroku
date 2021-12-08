import labelmake from "labelmake";
import font_GenShinGothic from "../module/font_GenShinGothic"
 
const font = { font_GenShinGothic };

 // 領収書PDF
export const MakeReceipt =  async (user) => {
    const template = {
      fontName: "font_GenShinGothic",
      basePdf: { width: 210, height: 297 },
      "schemas": [
      {
        "field1": {
          "type": "text",
          "position": {
            "x": 20,
            "y": 20
          },
          "width": 150,
          "height": 15,
          "alignment": "center",
          "fontSize": 30,
          "characterSpacing": 0,
          "lineHeight": 1
        },
        "field2": {
          "type": "text",
          "position": {
            "x": 20,
            "y": 35
          },
          "width": 150,
          "height": 10,
          "alignment": "center",
          "fontSize": 20,
          "characterSpacing": 0,
          "lineHeight": 1
        },
        "field3": {
          "type": "text",
          "position": {
            "x": 20,
            "y": 45
          },
          "width": 150,
          "height": 200,
          "alignment": "left",
          "fontSize": 12,
          "characterSpacing": 0,
          "lineHeight": 1
          }
        }
      ]
    }
    const itemsContents = user.cartItemList.reduce( (a,c) => a + "商品名：" +  c.Item.name + '\r\n','' )
    const total = user.cartItemList.reduce( (a,c) => a + c.subtotal - (c.Item.discount ? c.Item.discount * c.number : 0 ),0 )    
    const textContents =                 
        "■メニュー　\r\n" + itemsContents +        
        "■合計金額(税込)" + total   + "円\r\n" +
        "＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\r\n" +
        "株式会社らくらくcoffeeジャパン \r\n"

    const inputs = [{"field1":"領収書","field2":"決済内容","field3":textContents}];
    const pdf = await labelmake({ template, inputs, font });    
    
    // Browser
    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    // console.log(blob);    
    // console.log(URL.createObjectURL(blob))    
    return URL.createObjectURL(blob)
  }
