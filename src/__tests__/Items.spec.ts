// Sample.ts squareのテストコード
import { GetCoffeeById } from '../components/Items';

describe('Items.ts Functions TestCases', () => {
  it('should return the squared value', () => {
    const expected = {  id: "d5140ef5-8448-4c74-bbec-43df2f4c4253",
                        coffee_name: "キャラメルフラペチーノ",
                        coffee_detail: "コーヒー、ミルク、キャラメルシロップを氷とブレンドした、多くのお客様に愛されているフローズン ビバレッジです。トッピングしたホイップクリームとキャラメルソースと混ぜながら、豊かでほんのり香ばしいキャラメルの風味をお楽しみください。",
                        img:"http://127.0.0.1:8000/media/posts/%E3%82%AD%E3%83%A3%E3%83%A9%E3%83%A1%E3%83%AB%E3%83%95%E3%83%A9%E3%83%9A%E3%83%81%E3%83%BC%E3%83%8E.jpg",
                        coffee_priceL: 570,
                        coffee_priceM: 490,
                    }
    
                    
    const data = [{ id: "d5140ef5-8448-4c74-bbec-43df2f4c4253",
                    coffee_name: "キャラメルフラペチーノ",
                    coffee_detail: "コーヒー、ミルク、キャラメルシロップを氷とブレンドした、多くのお客様に愛されているフローズン ビバレッジです。トッピングしたホイップクリームとキャラメルソースと混ぜながら、豊かでほんのり香ばしいキャラメルの風味をお楽しみください。",
                    img: "http://127.0.0.1:8000/media/posts/%E3%82%AD%E3%83%A3%E3%83%A9%E3%83%A1%E3%83%AB%E3%83%95%E3%83%A9%E3%83%9A%E3%83%81%E3%83%BC%E3%83%8E.jpg",
                    coffee_priceL: 570,
                    coffee_priceM: 490,
                },
                {   id: "4b16547d-a64e-4ed3-882a-3f8c07b3334e",
                    coffee_name: "Gorgeous4サンド",
                    coffee_detail: "人気の定番具材「ハム」と「チキン」をセットにした食べごたえ抜群のサンドイッチです。",
                    img: "http://127.0.0.1:8000/media/posts/Gorgeous4%E3%82%B5%E3%83%B3%E3%83%89.jpg",
                    coffee_priceL: 700,
                    coffee_priceM: 480,
                }]

    expect(GetCoffeeById("d5140ef5-8448-4c74-bbec-43df2f4c4253", data)).toStrictEqual(expected);
  });
});