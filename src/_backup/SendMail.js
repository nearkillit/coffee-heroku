export const sendMail = (user) => {
    /* SmtpJS.com - v3.0.0 */
    var Email = { 
        send: function (a) { 
            return new Promise(function (n, e) { 
                a.nocache = Math.floor(1e6 * Math.random() + 1)
                a.Action = "Send"; 
                var t = JSON.stringify(a); 
                Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) 
            }) 
        }, 
        ajaxPost: function (e, n, t) { 
            var a = Email.createCORSRequest("POST", e); 
            a.setRequestHeader("Content-type", "application/x-www-form-urlencoded") 
            a.onload = function () { var e = a.responseText; null != t && t(e) }
            a.send(n) 
        }, 
        ajax: function (e, n) { 
            var t = Email.createCORSRequest("GET", e); 
            t.onload = function () { var e = t.responseText; null != n && n(e) }
            t.send() 
        }, 
        createCORSRequest: function (e, n) { 
            var t = new XMLHttpRequest;            
            return "withCredentials" in t ? 
                t.open(e, n, !0) 
                : 
                "undefined" != typeof XMLHttpRequest ? 
                    (t = new XMLHttpRequest).open(e, n) 
                    : 
                    t = null,
                t 
        }       
    };    
         
    const itemsContents = user.cartItemList.reduce( (a,c) => a + "商品名：" +  c.Item.name + '\r\n','' )
    const total = user.cartItemList.reduce( (a,c) => a + c.subtotal - (c.Item.discount ? c.Item.discount * c.number : 0 ),0 )    
    const mailContents = 

        "【らくらくcoffee　ご注文内容確認のご連絡】\r\n" +        
        "この度はらくらくcoffeeをご利用いただき、誠にありがとうございます。\r\n" +
        "以下の内容でご注文を承りましたのでご確認ください。\r\n" + 
        
        "■お受け取り日時 " + user.orderDate +"\r\n" +
        "■メニュー　\r\n" + itemsContents +        
        "■合計金額(税込)" + total   + "円\r\n" +
        
        "変更・キャンセルの場合は、お受け取り時間の2時間前までにお電話にて承ります。\r\n" +
  
        "※本メールは送信専用です。\r\n" +
        "※本メールにお心当たりのない方は破棄していただきますようお願いいたします。\r\n" +
        "＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\r\n" +
        "株式会社らくらくcoffeeジャパン \r\n" +
        "〒160-0022 東京都新宿区新宿4-3-25 TOKYU REIT新宿ビル8F\r\n" +
        "URL     https://www.rakus-partners.co.jp/ \r\n" +
        "TEL　　　03-6675-3638"    

    Email.send({    
      Host : "smtp.elasticemail.com",
      Username : "massurumatsuyama@gmail.com",
      Password : "0BCB98EDA038FBEA37D524558337807113F7",
      To :  user.email, // 送り先
      From : 'massurumatsuyama@gmail.com',
      Subject : "【らくらくcoffee】ご注文内容の確認メール",
      Body : mailContents

      
    }).then(message => 
        console.log(message)
    );

}


   
