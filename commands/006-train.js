const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

//334
const arrtr = ['https://cdn.discordapp.com/attachments/1166698342319931416/1202576450226622504/image.png', //名鉄 314f(車番334)
               'https://cdn.discordapp.com/attachments/1166698342319931416/1202579509669273632/image.png', //JR海 313系(列番334f)
               'https://cdn.discordapp.com/attachments/1176928475085541468/1208070741786886154/image.png', //小田急 3095f(車番3345)
               'https://cdn.discordapp.com/attachments/1176928475085541468/1208071540571250789/image.png', //小田急 3084f(車番3334)
               'https://cdn.discordapp.com/attachments/1176928475085541468/1208072261983010816/image.png', //小田急 3094f @五月台(車番3344)
               'https://cdn.discordapp.com/attachments/1176928475085541468/1208072768546152448/image.png', //小田急 3094f @小田急永山(車番3334)
               'https://cdn.discordapp.com/attachments/1220650107171508254/1239158560726712412/image.png' //JR東海 N700A-F5 @小田原(のぞみ334号)
               ];
const arrmelo = ['https://cdn.discordapp.com/attachments/1220650107171508254/1259425871761244220/334melody.mp4?ex=668ba33e&is=668a51be&hm=1e310e1e7cb4135bc8cfe89159fc20cf26f280940dd7fa147f0d7b6d6a33d705&', //ドリームパーク
                'https://cdn.discordapp.com/attachments/1176928475085541468/1217083794885185538/ver_...5_...5.mp4?ex=6602bc9d&is=65f0479d&hm=2970873e68def1978df9017ae62fb82abb745cc98ebdd7fe8560a00172e22a0e&',　//希望の轍イントロ
                'https://cdn.discordapp.com/attachments/1176928475085541468/1217085392491384932/ver_...6_...6.mp4?ex=6602be19&is=65f04919&hm=a7010ae20e6b3368267ecef7cdd95d06586f13f977cde00237a91581f74ec76a&', //希望の轍サビ
                'https://cdn.discordapp.com/attachments/1198949145403203704/1257297837386104862/19_1.mp4?ex=6683e55b&is=668293db&hm=558e25ff9cabcf489c740f3fd6bab19306fca3f2a85630840b19396fb714569a&', //近郊地域19番
                'https://cdn.discordapp.com/attachments/1220650107171508254/1264410976204230695/334melody.mp4?ex=669dc5fc&is=669c747c&hm=d6ce2f1fa25ac192fea2f34a8a11041c5a1d83dcc51686f21434e064e143a9ac&', //ビューチャイム
                'https://cdn.discordapp.com/attachments/1220650107171508254/1223856026328105031/752fe1d8df41e09b.mp4?ex=661b5fbe&is=6608eabe&hm=dc605f0e6ff6debc9172f8186b619e9fc33c6b5557e499c6b8447eb708598a33&', //恋の通勤列車
                'https://cdn.discordapp.com/attachments/1220650107171508254/1223856026793541692/584fb73e8b70d2fe.mp4?ex=661b5fbe&is=6608eabe&hm=ac86b334c0ea550146063f0aab25b8f87d1a625279eee288fa0e1ee1788afde6&', //鉄道唱歌
                'https://cdn.discordapp.com/attachments/1312791757033046016/1313436630702489600/334melodyVerde_Rayo_.mp4?ex=675020af&is=674ecf2f&hm=f96a28ee84bddc88658f5fc92782a56f73851296f33e29d01eee58b830c392fa&', //Verde Rayo
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546165407059989/334melody_ver.mp4?ex=67165189&is=67150009&hm=c1ad42282e0b02be79ffe7c8723ab7bcd74d8732ddec185b83c421d8890e3993&', //思い出のアルバム サビ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546165990064159/334melody_Aver.mp4?ex=67165189&is=67150009&hm=35c5cea4ce385aa6fac0efb8fcb507520d5c45bf4ca01e3905a8ffd98dc84198&', //思い出のアルバム Aメロ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546164584976384/334melody_ver.mp4?ex=67165188&is=67150008&hm=fc4886c741704665fa652b184fbbf4b0d2139283b6dc45f0f7bb215ef7b97240&', //今日の日はさようなら 下り
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546165063122984/334melody_ver.mp4?ex=67165188&is=67150008&hm=2cef63011c1f710b5908dc7316ed561e51914af221418c534cc9e970461aa8b1&', //今日の日はさようなら 上り
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546163960021026/334melody.mp4?ex=67165188&is=67150008&hm=4a71b1f58a364ea349ce5081d8c7b686b22357a1e9ad796b874e28d4b00234e7&', //西部警察メインテーマ
                'https://cdn.discordapp.com/attachments/1312791757033046016/1338805768308260885/334melody_1.mp4?ex=67ac6b88&is=67ab1a08&hm=fec1b6d4f2ef6a59f4e536a6cf2fa78b6b4ac0d21e7de7014df44be0f96c1c40&', //太陽にほえろ！のテーマ
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925845124092027/334melody_Aver.mp4?ex=678fc0c8&is=678e6f48&hm=61e74cbc791d883f7c0f0b7aeb7c728cfed0c90a623785804ece6974989c189d&', //ありがとう Aメロ
                'https://cdn.discordapp.com/attachments/1312791757033046016/1338805768652197929/334melody_ver_1.mp4?ex=67ac6b89&is=67ab1a09&hm=eb0a209e115d7c92d15c9213058509a2926854f83202de45f044a93044bfdf69&', //ありがとう サビ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546160801579028/334melody.mp4?ex=67165187&is=67150007&hm=a8594d90d6d27ce7aece32201dd5027a75e8b5dea479e1d82b56ae255dd3fc88&', //ヒーロー
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546161229533214/334melody.mp4?ex=67165188&is=67150008&hm=467793d1dc38b10cffb7c1e2621f82f3fada50a3ec28ae695320527d804e5581&', //あとひとつ
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925841911386223/334melody.mp4?ex=678fc0c8&is=678e6f48&hm=3ff7131a23b35b98b4d14b93cd3d09c498226152bdacb2e1e549dffee1ddcc2a&', //会いに行こう
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353655477157756928/334melody.mp4?ex=67e27167&is=67e11fe7&hm=a544dae0d8ed4755d05e43c8c9643a9d995621ca25429227d593bfb967bdc7b2&', //ロマンスをもう一度
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287327742595102/029562e93728ab57.mp4?ex=66460316&is=6644b196&hm=00f3ed7a24194e5672b1c12492365b27a8e79d20c1e6287f4e92c1e19f49f84a&', //常盤木
                'https://cdn.discordapp.com/attachments/1220650107171508254/1282332326977732649/334melodyVerde_Rayo_V2.mp4?ex=66def88b&is=66dda70b&hm=8c29797dfb8b90f74c43942d7d9627f377b4409d874fc058f703c0125c322ec2&', //verde rayo v2
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652691531730954/334melody_verA.mp4?ex=67e26ecf&is=67e11d4f&hm=da3d93ef61b69a3173fe74e7c03e664ee3963022938301e4839498bfbb750b37&', //さくら verA
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287328967331871/verB.mp4?ex=66460316&is=6644b196&hm=bfeeaba81e797b56d382c5ad79261843bfab8e2522969bba06c1af70b47fd42a&', //さくら独唱verB
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287329374048256/4ed543c5ff569826.mp4?ex=66460316&is=6644b196&hm=0e34813e9ca620f31a3822f017c6b5eb007f007288d0485ae62b827b15cfc4ec&', //君の名は希望 サビ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287329663582369/fa7e7603ea1ae051.mp4?ex=66460316&is=6644b196&hm=809ddb78a8ae8a7ab49daee5e222beff2cd41c334af1f9663e9700f6d9e0e35b&', //君の名は希望 イントロ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287330015907921/bd17f68d48bed8b8.mp4?ex=66460316&is=6644b196&hm=17a26abb6d441e35e645fcb5c872f3f2f598f48eaaa888fa5893515080cdb0c4&', //三つの願い
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287330376487073/878283c78f3351e0.mp4?ex=66460316&is=6644b196&hm=46779b0613a3d5e6bdc208ba186dd43d34d78f46a9c486e37f05f35c34141012&', //カトレアの花束
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287330783461456/c70ddf5e6638bb34.mp4?ex=66460317&is=6644b197&hm=c054da9d09550ad5e6e1558c641be534261c7036d522f2aafe5809a662d9323b&', //若葉の散歩道
                'https://cdn.discordapp.com/attachments/1220650107171508254/1240287331160821780/departing_from_new_Shibuya_terminal.mp4?ex=66460317&is=6644b197&hm=eb775fe351b5017ab466badea579029204c0c4cd282407172ffb316b228f06ba&', //departing from new shibuya terminal
                'https://cdn.discordapp.com/attachments/1220650107171508254/1249283278045843550/4.mp4?ex=6666bd38&is=66656bb8&hm=a2e489a5deba32f766261635fb305150e8cd1863e3072bb2d64b6f19db9da527&', //4点チャイム
                'https://cdn.discordapp.com/attachments/1220650107171508254/1249284934963564554/fb16b13f08700b00.mp4?ex=6666bec3&is=66656d43&hm=8cc29e445cb61895c291b9efbcd155eba08e8180469e4cb081abd97e4c05f37d&', //君の願いが世界を輝かす
                'https://cdn.discordapp.com/attachments/1220650107171508254/1249285628789784597/Living_in_color.mp4?ex=6666bf68&is=66656de8&hm=88a3438495fe929e1f38b70f39835fc0b564fd13d585e06e62bff632c75f57b5&', //Living in color
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925842494259311/334melody_1.mp4?ex=678fc0c8&is=678e6f48&hm=30e131c92189126a892f5cbf526038906a77fb49f61b9f95ce11c9d315a4ade7&', //あゝ上野駅
                'https://cdn.discordapp.com/attachments/1220650107171508254/1259436069925945344/334melodyJR-SH5-3.mp4?ex=668bacbe&is=668a5b3e&hm=636d58897910010c7ae3f97a218e24f539315ffb6d102433f906aae0e0d92247&', //JR-SH5-3
                'https://cdn.discordapp.com/attachments/1220650107171508254/1264402210410987611/334melody_1.mp4?ex=669dbdd2&is=669c6c52&hm=6deaedc3ada188253b37e05fbd38c46bf3d2f861761632e6412ce5ffeb6765e8&', //北陸ロマン
                'https://cdn.discordapp.com/attachments/1220650107171508254/1264404971810586664/334melodyA.mp4?ex=669dc064&is=669c6ee4&hm=1794ff3f06c9b021bbdcaf0d320f1dc4c0b82409390cdb31a6b551a7955c284d&', //夏は来ぬ Aver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1264406376730329168/334melodyTR12.mp4?ex=669dc1b3&is=669c7033&hm=da1e67d2c063a753de438b0b8e385349fb1d40ea3f5c19a0be67a6da954c15de&', //TR12
                'https://cdn.discordapp.com/attachments/1220650107171508254/1264408559127625769/334melody_ver.mp4?ex=669dc3bc&is=669c723c&hm=dcb085bbb4de6bbbea118f51dbe11c136f4607c6439e6fd7cd1b5a6aa59372da&', //鉄道唱歌 電子音ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1264410126354485328/334melody_185ver.mp4?ex=669dc531&is=669c73b1&hm=b3dbabb9fbfd55eccc7eb58a55be8da472fdd19bb3be04a00b578aceaaa50d6d&', //ひたちチャイム 185ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314448969269310/334melody.mp4?ex=66a4b2bb&is=66a3613b&hm=b20f34bcfe887c93832521595557e0080710130feb7c64602341f097bb3f6428&', //ニュルンベルクのマイスタージンガー
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314448641982546/334melody.mp4?ex=66a4b2bb&is=66a3613b&hm=6a7a40313b5baa24ae0ec71b12575c7451391ea0eeb6f7358de791dbb091b57c&', //イタリア
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314448314830889/334melodySAKURA_Bver.mp4?ex=66a4b2bb&is=66a3613b&hm=9b7deda311c231d3815711b64be1a96583d50c7b352f8565e1fb42851bb4bbd0&', //SAKURA Bメロver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314448029745235/334melodySAKURA_ver.mp4?ex=66a4b2bb&is=66a3613b&hm=477dfdf86a20b61c31ef4c8e4b6723db7a42dfa85563e98012844cd30b31c406&', //SAKURA サビver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314447698399253/334melodyYELL_ver.mp4?ex=66a4b2bb&is=66a3613b&hm=bdde0e304a41002edb97de32a4c9eb105e3726a4227a537ce52f9ce70572432f&', //YELL イントロver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314447404666951/334melodyYELL_ver.mp4?ex=66a4b2bb&is=66a3613b&hm=44b771c0e51ba9b70503ef9678bd1dfef1a6d8d36aa5c5a4adc9531c2dcafeca&', //YELL サビver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314447073443891/334melody.mp4?ex=66a4b2bb&is=66a3613b&hm=4bf1a3c699c242e2be7fd9afd0a77c78aabbe69d2fab724e91d9ac83852ee5c3&', //負けないで
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266314446729515018/334melody.mp4?ex=66a4b2bb&is=66a3613b&hm=672a80dd17a7cba241bfb41131888720de689057f03a1a861caec33929f11f39&', //揺れる想い
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266741330252398664/334melody4.mp4?ex=66a6404c&is=66a4eecc&hm=dd7fed5ed4aedc088488df9520f5293798472aaf64ec30b9a623e3ae18f7f003&', //4打点チャイム
                'https://cdn.discordapp.com/attachments/1220650107171508254/1266741329912922112/334melodySPACIA_X.mp4?ex=66a6404b&is=66a4eecb&hm=cb348415fd220cfdf70e341d36276089f8441c631977fcb401ab2d3ea1008b44&', //SPACIA Xチャイム
                'https://cdn.discordapp.com/attachments/1220650107171508254/1267823302165135402/334melody.mp4?ex=66aa2ff6&is=66a8de76&hm=7a599c4c90470e97df30c2bfc1e06844c9cab1ba4f6ba1e2a17f4a4573f1a4b0&', //曲名不明(多摩モノレール上北台方面)
                'https://cdn.discordapp.com/attachments/1220650107171508254/1267824155496026234/334melody.mp4?ex=66aa30c1&is=66a8df41&hm=3211a2647dc4e1626a02c76a9c0bbbc5af37314f82313cecb98ae3f40aebbf4a&', //曲名不明(多摩モノレール多摩センター方面)
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846352019230850/334melody.mp4?ex=66bc760a&is=66bb248a&hm=1ed460046945ca55dd0e9d58255367e95fa3b001f868818aa196ac4dae73307e&', //サンダーチャイム
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925857061212200/334melody_1.mp4?ex=678fc0cb&is=678e6f4b&hm=a323c3b0597428d8fc2e48b22c6b2caca13c9b904c194020fd9c1617d112f72a&', //やっぱ好きやねん
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846351406731306/334melody.mp4?ex=66bc760a&is=66bb248a&hm=e6656deec456442fcc1bbeb6cc63687796889d3ae4f445cb6c7ab87dc11dd835&', //きなんせ節
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846351092154368/334melody999_Aver.mp4?ex=66bc760a&is=66bb248a&hm=c03e4872e142ffa4cc495d2894cb0e9524b91c03bebdcb3c99b85a8166d9c750&', //銀河鉄道999 Aメロver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846350727381106/334melody999_ver.mp4?ex=66bc760a&is=66bb248a&hm=8946347d7ffbd8dacbea69fd653fa1c0e4d0c724e45ca062a6571ea27ca6b511&', //銀河鉄道999 verサビ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846350379126856/334melody.mp4?ex=66bc760a&is=66bb248a&hm=d8aed8333df92d798233c9eed9a53aeaf7cb8541a08b0abdf91e1a1a69359b61&', //ひかりチャイム
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846349464768522/334melody.mp4?ex=66bc760a&is=66bb248a&hm=4078a799e22388747d129c1c806f62de842bfb0d1be6f956712394bf1f301f36&', //線路は続くよどこまでも
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846349821546536/334melody.mp4?ex=66bc760a&is=66bb248a&hm=cb9aa19494a00c1f74b01c7844492830c475bd3bd4305fffcb00572fb66b1949&', //桃太郎
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846349070499890/334melody.mp4?ex=66bc7609&is=66bb2489&hm=73fb01b55f71c1ffab71b7ab154896479c0e7028863d56b391fc4c3bd201833a&', //瀬戸の花嫁
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846436224208978/334melody.mp4?ex=66bc761e&is=66bb249e&hm=8b1c6778c1f1e7bcf89cce03e5cb6ac2287a0113c779f48083e7b55b0a295870&', //汽車
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846435578155101/334melody.mp4?ex=66bc761e&is=66bb249e&hm=194190de39a659dda07e43df1fede72b51815f7f0e24f60a93e9c377c05bfc5e&', //いい日旅立ち
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846435037085716/334melody_ver.mp4?ex=66bc761e&is=66bb249e&hm=8d1ec418827c005e78c83dbfb37109d14513b38f242b922d14b1560abfca9cd0&', //見知らぬ国から 始終着駅ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846434651213896/334melody_ver.mp4?ex=66bc761e&is=66bb249e&hm=f2be4107a9579dcfe5f94cef0df63832094a8c6338fad2937947b4603034a8bf&', //見知らぬ国から 途中駅ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846434093502557/334melody_ver.mp4?ex=66bc761e&is=66bb249e&hm=66162184f71a891a7647bb7ea3805ffac02b11558254777fd7afc04dea02e4b8&', //いい日旅立ち・西へ 途中駅ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846433447575562/334melodyJR_.mp4?ex=66bc761e&is=66bb249e&hm=1ebd5d2b862e85db9d48c65f5721b434df5ad2ac62f25c45f350b0766ae0cb01&', //JR西日本 標準入線メロディ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846433032343624/334melodySmile_ver.mp4?ex=66bc761d&is=66bb249d&hm=540269b124edcef0fc348f2ea25b58683f07e15734ddc07f68b5ac52f7b6481c&', //Smile 上りver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846432180899871/334melodySmile_ver.mp4?ex=66bc761d&is=66bb249d&hm=114ff64663f7280babb7dae18a68bc0b62f239ab8027e34eee59b4fa5e40bc6a&', //Smile 下りver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1272846432591806494/334melody.mp4?ex=66bc761d&is=66bb249d&hm=04866e83148bf8a9967e495dacce8aa7ea34713aebd835e144258828b9af0c8c&', //さくらんぼ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1281602040178540646/334melody_ver.mp4?ex=66dc5069&is=66dafee9&hm=d0ce40e837ff3eaa0808882cdb29e0dfa22c305b14b0e4161c5a65384c089e0f&', //東海型B-a
                'https://cdn.discordapp.com/attachments/1220650107171508254/1281602040778330122/334melody_ver.mp4?ex=66dc5069&is=66dafee9&hm=cccd903e72af8ed99da4af237b2b6fcdf19b9e15584cd004ad1a8ab7e2dff414&', //ワタリドリ サビver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1281602041235378206/334melodyB-a.mp4?ex=66dc5069&is=66dafee9&hm=263529c298937a1864519bd08c20d8aff143d5998d62ba1b83f930e9c06102ba&', //ワタリドリ イントロver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1282332326344396851/334melody3.mp4?ex=66def88b&is=66dda70b&hm=eac8de86634bbab6c6b60df25c39147e0718805cec7a4e5f7718dc3505944434&', //東海道3番
                'https://cdn.discordapp.com/attachments/1220650107171508254/1282332325929025617/334melody4.mp4?ex=66def88b&is=66dda70b&hm=3e72cf15a285d02bc904f7eb6c4b7cf111a8e4e3be005bcb61cb479a38eca9a0&', //東海道4番
                'https://cdn.discordapp.com/attachments/1220650107171508254/1282332325501337731/334melodyJR-SH5.mp4?ex=66def88a&is=66dda70a&hm=1af730bf27ecc242ebb3878dc4b265f3c2d2602d224c78b99f9277441c644b75&', //JR-SH5
                'https://cdn.discordapp.com/attachments/1220650107171508254/1282332325165928569/334melody_V5.mp4?ex=66def88a&is=66dda70a&hm=d6ace3e8a13c507417b86ddb6f3dcafd050033b875783405f744c1a729bce219&', //みかんの花咲く丘 V5
                'https://cdn.discordapp.com/attachments/1220650107171508254/1282332324637179936/334melody_V1.mp4?ex=66def88a&is=66dda70a&hm=a628e2fd2cd52c422c35401ed05660b155b267d394638838ad33b9c0f7da3ea9&', //みかんの花咲く丘 V1
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581164008439900/334melody.mp4?ex=66f9578c&is=66f8060c&hm=1c6deb502750dd20e93fcfb47d93714e41d65a98ba7383176bedd510fd30fd7b&', //北陸標準接近メロディ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581163622568086/334melody_ver.mp4?ex=66f9578c&is=66f8060c&hm=c14cbea8c0a34c97448fdd87f09d264cf9a74935f914c5bfb6c33277cb4ee2c7&', //北陸標準接近メロディ 金沢ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581162917920888/334melody.mp4?ex=66f9578c&is=66f8060c&hm=4e5c567510df6ddd3c07e0b2ad94a6a099e17572b1ae5729df18061e387153d3&', //ハナミズキ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581162540437575/334melody.mp4?ex=66f9578c&is=66f8060c&hm=2adc06d3946dfda46bd4425d35caf2b11b68309237cb469a6140219f2ea4f833&', //北陸標準発車メロディ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581162125197384/334melody_ver.mp4?ex=66f9578c&is=66f8060c&hm=950eff8e86a8de2fcab819c728d6cff936b569988ac5120bfef73467773f89aa&', //鉄道唱歌 新幹線ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581161731067986/334melody.mp4?ex=66f9578c&is=66f8060c&hm=8f24d545e26eac56dab84170e65e47f3dd849c154dce671ee2b729441684a2a6&', //煌〜水の都から〜
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581161298792588/334melody_verA.mp4?ex=66f9578c&is=66f8060c&hm=d78030da0823911dfda942f89b9d98df139a8a0f3d791b3e1dc8b6e7d0256dde&', //ふるさとの空 verA
                'https://cdn.discordapp.com/attachments/1220650107171508254/1289581160871235687/334melody.mp4?ex=66f9578c&is=66f8060c&hm=620ffc530866e29015b9b3f8ac533f027f222c486cbebf395bde73903403deb2&', //オリジナル曲(富山)
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546164044042261/334melody_verA.mp4?ex=67165188&is=67150008&hm=b30fdba02dfa55d8fabaed75b4ed840768777c2e33eb55bbb25fd3eccf9ed881&', //明治大学校歌 verA
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546163712430090/334melody_verB.mp4?ex=67165188&is=67150008&hm=fe9e216b8137433f1a3e3eaa0a1a4408c65364d157b1865ccca918039a188e49&', //明治大学校歌 verB
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546163251318835/334melody.mp4?ex=67165188&is=67150008&hm=bf74fd87708cbb9f04cf0b90cc57e497492ae18d72e04cd76c42f4d48a0dc4f0&', //曲名不明(京王ライナー接近)
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546162835951638/334melody.mp4?ex=67165188&is=67150008&hm=5487653e39711436c8cd5e1e0bfdfb388c3ad2cc14455b4d48c69631557639ab&', //ガーランド・ワルツ
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546162106138655/334melody.mp4?ex=67165188&is=67150008&hm=77bb011d1bd4ed7a62abd71fb59c6cca443ddc725d748df6ad8252bb46ad6aac&', //凱旋行進曲
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546161531654287/334melody_.mp4?ex=67165188&is=67150008&hm=a594dd7d484461522c82ea061217858f4f34e8732c543b015984c700be6a5018&', //曲名不明(京王ライナー車内)
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546160441135195/334melody_Aver.mp4?ex=67165187&is=67150007&hm=c2100f4db7593dcfcc4671f8a75c7e17af428564cff68e4af38f622301c343f7&', //カントリーロード Aメロver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546160088551444/334melody_ver.mp4?ex=67165187&is=67150007&hm=79e9461e67bb0bbdaa8906234e5805ef4f2a38eae84dfc7750bf05fdac9133ec&', //カントリーロード サビver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546167126724638/334melody.mp4?ex=67165189&is=67150009&hm=553cd4438bb5f4e863b93dc6433e64fef299a3c1d69d5b210785572511df2c0b&', //ぶんぶんぶん
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546166766145586/334melody_Aver.mp4?ex=67165189&is=67150009&hm=f9d3bdc913673f45691dec3f0dec9fa1e5aeda5e902dd51b466fe33044cf0e0d&', //新選組 メイン･テーマ Aメロver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546166421946459/334melody_ver.mp4?ex=67165189&is=67150009&hm=fc6f01b197747603d40191ff0afad67da096bf99d4db34fa7b6215b5ceb9420e&', //新選組 メイン･テーマ サビver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1338805767998017577/334melody_ver_1.mp4?ex=67ac6b88&is=67ab1a08&hm=8ea00dc7f4f37d89e7d577c278a1ac6433d7168e4bec7dbae815a172aac4b493&', //いつでも夢を 冒頭ver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1338805767582515300/334melody_ver_1.mp4?ex=67ac6b88&is=67ab1a08&hm=d59e217af0646b42b5cdfea1081783af38520d9a75d6c43d529f698667ef4c42&', //いつでも夢を 末尾ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546161993023590/334melodyShall_we_dance_ver.mp4?ex=67165188&is=67150008&hm=58ce9a611ad5076f6bd91077624cb4e5154412e0d1c08ef2a61c975bacabce7f&', //Shall we dance? 冒頭ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546161627857039/334melodyShall_we_dance_ver.mp4?ex=67165188&is=67150008&hm=d898a19e813030d8c810c3549201bd6ff8adc45e64732fab2ed5187f4891ed5d&', //Shall we dance? 末尾ver
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546161288249395/334melodyVictory.mp4?ex=67165188&is=67150008&hm=ee1ad8de1b337f96c0164a6f93bf5e51f61de4196195bd1ebd5e4aa7bd784323&', //Victory
                'https://cdn.discordapp.com/attachments/1220650107171508254/1297546160977875106/334melodyWith_You.mp4?ex=67165188&is=67150008&hm=a2836229022bf6dc9273a9224120c985fd7f33602ccff1dd239dfe1e8e5e575f&', //With You
                'https://cdn.discordapp.com/attachments/1220650107171508254/1302921482200158238/334melodyGreat_Messenger.mp4?ex=6729dfb0&is=67288e30&hm=ce27edcaa794831ca29192a06c57847fa6f5033d0aef2d7a6c8f794fb85b7464&', //Great Messenger
                'https://cdn.discordapp.com/attachments/1220650107171508254/1302921482531246111/334melody.mp4?ex=6729dfb0&is=67288e30&hm=119a9aaffa814dbc46a697e4e54395d7dd60df08e362deef065cf02b12762899&', //さらば青春の光
                'https://cdn.discordapp.com/attachments/1220650107171508254/1302923103319363654/334melody.mp4?ex=6729e132&is=67288fb2&hm=d324c004601be6276e8247fa04751b13945addb05249226ed09ed4bc786b4ee5&', //ハイケンスのセレナーデ
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807396929703977/334melodyJR-SH1-3.mp4?ex=674dd6aa&is=674c852a&hm=8cbd3ee7ae55b3d79523fc0facaff3818c65e0c7ac5e906a8553dfca3336255c&', //JR-SH1-3
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807396594421831/334melody11.mp4?ex=674dd6aa&is=674c852a&hm=3ba3abdf214c7922c5d26c53e338b1e4fde3e8450c5334928b0135ea49a90f93&', //首都圏11番
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807396200026173/334melody_ver.mp4?ex=674dd6aa&is=674c852a&hm=3eb888401a6e890ced0cf235d80a6dd370f8750c2e6ce0745fbb8704427cb1dd&', //赤い電車 サビver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807395822407741/334melody_Bver.mp4?ex=674dd6a9&is=674c8529&hm=0d262c68e46d65e07dac12d180d88305177e3e16a8aa778a9eadd688893c5013&', //赤い電車 Bメロver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807395495514112/334melody.mp4?ex=674dd6a9&is=674c8529&hm=a6ecbfdb43d2368091e5372ffff5b0e47cd8499cd25ebf6e746904a431cec69e&', //トレイントレイン
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807395088535613/334melodyJR-SH7.mp4?ex=674dd6a9&is=674c8529&hm=6a48cde4a78f4c2f8e26d45a03056f418d57b9d5d70721a7e15c879458ab1064&', //JR-SH7
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807394752860280/334melody12-1.mp4?ex=674dd6a9&is=674c8529&hm=848d887a3f4c83835eb8b5f59d4658168424cc2a482e4b9b5a117097f4cd74e2&', //首都圏12-1番
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807394409189387/334melodycielo_estrellado_ver.mp4?ex=674dd6a9&is=674c8529&hm=37f5bc09d7efb0577c8d3b87f239eba0ead8e63fc2bf55656f2701bf19849326&', //cielo低音
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807393956073542/334melodywater_crown_ver.mp4?ex=674dd6a9&is=674c8529&hm=8e80875c6d3aea8177908962281f52c58db5115a467dea9f3555861ea98dd78b&', //water crown低音
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807393557483540/334melodywater_crown_ver.mp4?ex=674dd6a9&is=674c8529&hm=e8a623c78de5b8a9a730fad04eef2f305d9cb1702294e4a1d3fb762ad6de2e1a&', //water crown標準
                'https://cdn.discordapp.com/attachments/1312791757033046016/1312807411614224597/334melodycielo_estrellado_ver.mp4?ex=674dd6ad&is=674c852d&hm=a8822311d22330cdc784410214fb25f66bb471bc1ec2c3e7572e27217907c3da&', //cielo標準
                'https://cdn.discordapp.com/attachments/1312791757033046016/1314951896313630801/334melody.mp4?ex=6755a3e2&is=67545262&hm=58f7b136bd2e7364f91f1f4586e6df08ada386d9329070ad7be85115785cbc91&', //言の葉青葉
                'https://cdn.discordapp.com/attachments/1312791757033046016/1314951895760113694/334melody_ver.mp4?ex=6755a3e2&is=67545262&hm=7c030bd8d4192c4b956f08b8dd88c2a3871aa5ab1e31596ad77689ac914c0662&', //青葉城恋唄 あおば通ver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1314951895378428018/334melody.mp4?ex=6755a3e2&is=67545262&hm=225d470a00b2ed4213a3a446eba53b54cb0c98159406b889b4b5988135f3c75d&', //羽ばたけ楽天イーグルス
                'https://cdn.discordapp.com/attachments/1312791757033046016/1314951896741711952/334melodySea_Green.mp4?ex=6755a3e2&is=67545262&hm=bd7be6e10a74edb1fb3808165213f4aeb8764cbea8662415f0717dc42acf2816&', //Sea Green
                'https://cdn.discordapp.com/attachments/1312791757033046016/1315265965675511858/334melody.mp4?ex=675c0e62&is=675abce2&hm=ca3134d2b2a3a0dae5b71a9a7f91a5e6f512d8e59379f91c715e5c6744c73d27&', //扉
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925846537703595/334melody.mp4?ex=678fc0c9&is=678e6f49&hm=d9bdc28e6d626fcafec1944418472b9b3b8a673fb0d4cfa414a567b85b385c20&', //海の駅
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925846101360691/334melody_1ver.mp4?ex=678fc0c9&is=678e6f49&hm=f8ddfb4d629d9222570a7c7ea4a0399ae821bfc1477e6b1d253516b40aca656d&', //くるみ割り人形 1番線ver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925845635928165/334melody_2ver.mp4?ex=678fc0c9&is=678e6f49&hm=5af8d596aa1ac3afab052faf1d19d3caae441fc93d19d34aedf8ce8a579c9217&', //くるみ割り人形 2番線ver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925856679264316/334melody_ver.mp4?ex=678fc0cb&is=678e6f4b&hm=35b22a353d83033653f46742cf047c7b3f94df012d6efbda3294c1ac1fdd8a08&', //いい日旅立ち 始終着駅ver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925857518256138/334melody.mp4?ex=678fc0cb&is=678e6f4b&hm=b51399887ec4a717fe948f8358f8c2a569003ed7d819c2bb074fecf32a2f3c59&', //大切なもの
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925841437294713/334melody.mp4?ex=678fc0c8&is=678e6f48&hm=f4dc83ba6e5e351bb8576fe17d015676f0909b8d7ddcaff7ca9f71882987cb40&', //プリンセスサンバ
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925843157094460/334melody_verB.mp4?ex=678fc0c8&is=678e6f48&hm=f011974696f7e93fa0e0605be3dc4843c48d0a212d51b82d497cf8b3cb766c5d&', //上を向いて歩こう verB
                'https://cdn.discordapp.com/attachments/1312791757033046016/1330925843999883335/334melodyB.mp4?ex=678fc0c8&is=678e6f48&hm=a59345bdcfa9b04e4b2e66c7d62e9fac655bdfbaa172944227fa0ca412533fec&', //川崎市歌B
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652618047782974/334melody_1.mp4?ex=67e26ebd&is=67e11d3d&hm=b43eb08d6a262199fe61ca39fe32d4e77af95a83aac3ec9252f6565579fb0656&', //夢をかなえてドラえもん
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652618408497162/334melody_1.mp4?ex=67e26ebd&is=67e11d3d&hm=91cf84937d44f65e91056bce641b6ac2a7a97fbe9c4662cc820b07cc531c98ba&', //すいみん不足
                'https://cdn.discordapp.com/attachments/1312791757033046016/1331570731548545076/334melodyJR-SH9-3.mp4?ex=67921961&is=6790c7e1&hm=c3d6698af3b06659fd01ef1fb488bbcf005c072712f28955d5d0db3910a22595&', //JR-SH9-3
                'https://cdn.discordapp.com/attachments/1312791757033046016/1331570731170922506/334melody17.mp4?ex=67921961&is=6790c7e1&hm=373fc6fe8bb8052ad562cab4ce3bcf40dda2dd1250ce0dc13bff94b6a16bf1fb&', //曲名不明(近郊地域19番)
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652619058610246/334melody_1.mp4?ex=67e26ebe&is=67e11d3e&hm=bb2d2b8e1e1b6c2abc14052f353dbdf4f0612275645b2a5003919148d3d85015&', //ぼくドラえもん
                'https://cdn.discordapp.com/attachments/1312791757033046016/1331572028624474112/334melody.mp4?ex=67921a97&is=6790c917&hm=ac741428c23537a7df1b7189e2f55cedf1ca65a9ddf18e97d3411dd2ae20a0b7&', //きてよパーマン
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652620807504023/334melody_ver.mp4?ex=67e26ebe&is=67e11d3e&hm=de42f08b4c3e45b9cf36b4b919e002000e955a1f2bed741f1e4f493605949d54&', //浜千鳥 高速ver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652620429885470/334melody_verA.mp4?ex=67e26ebe&is=67e11d3e&hm=ed4f0b64404b08c39d6ba589a169c964f67aa2527d7125a035e1fff8d03b5166&', //稲城繁盛節 verA
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652620040077333/334melody_verB.mp4?ex=67e26ebe&is=67e11d3e&hm=6ad3b690a899a0a149a1a6e6e20682d7c4f8fe2e397c46ee2d187d134526ced0&', //稲城繁盛節 verB
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652619687624735/334melody_ver.mp4?ex=67e26ebe&is=67e11d3e&hm=df2483e1e1acee120d264997d02a1672cd1b18c11afd5526491cc37cd49e8039&', //丘を越えて 上りver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652619364798484/334melody_ver.mp4?ex=67e26ebe&is=67e11d3e&hm=6640c16d19dca3371e42d0a81cf28eca567d575a2298a75dad1c7e4542fd9c4b&', //丘を越えて 下りver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652618739712022/334melody.mp4?ex=67e26ebd&is=67e11d3d&hm=1e9e491c2517ee23ffd21227337fa4b108075571a69465fa094af12088198ef0&', //ドラえもんのうた
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652617619832912/334melodyJupitar_ver.mp4?ex=67e26ebd&is=67e11d3d&hm=aaf06f7277d17e5e5d2ce29c6a2b1cebe0e723da8e3ff905d6b0a72b6147da46&', //Jupitar ソプラノver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652717880610928/334melodyJupitar_ver.mp4?ex=67e26ed5&is=67e11d55&hm=ca2644a27d7fc57bb2846484a5047c2bab2208fce522d5026e6b0c1fac15a3f6&', //Jupitar アルトver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652717418971198/334melodyJupitar_ver.mp4?ex=67e26ed5&is=67e11d55&hm=feb1c574133b95405345e0f6b0720bdbe7e266a2e2da551a5f0eb18816f0dbc5&' , //Jupitar 大サビver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652695042359316/334melodyJR-SH2-1.mp4?ex=67e26ed0&is=67e11d50&hm=3436247c128980943ab4c4edfd36bbf2ad986916d19c55cdb7a84ee67d3c2f55&', //JR-SH2-1
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652694736179232/334melodyJR-SH5-1.mp4?ex=67e26ed0&is=67e11d50&hm=1dc50328dc2f2a21935d89848eea773c3b8410bfb8a67f6317d94f1d8b99507b&', //JR-SH5-1
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652694383988739/334melodyFRONTALE2000.mp4?ex=67e26ecf&is=67e11d4f&hm=d20d0085d661feac4c32deb5eda236b1b5c5e25fb35d9dccb732f31c910f64f0&', //FRONTALE2000
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652693851443250/334melodyFRONTALE20000.mp4?ex=67e26ecf&is=67e11d4f&hm=60af858798cfbcf76e279875a5cbc24934dd25f1829527b8e1b9c34c13a9e6a0&', //FRONTALE20000
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652693436203078/334melody.mp4?ex=67e26ecf&is=67e11d4f&hm=81e4412100606b8f753b6c688ccdb4582fc8f8c526dac617d7e920b4c10372ee&', //ナンバーワン野郎！Aver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652692978896916/334melodyBver.mp4?ex=67e26ecf&is=67e11d4f&hm=8f7670eecb1277c6d37544cd3f3749f4b0462bc442ce99019017067759077331&', //ナンバーワン野郎！Bver
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652692609667152/334melody_verA.mp4?ex=67e26ecf&is=67e11d4f&hm=e3dc52908e8f32b2a6b372621dac971e2da0319db355c89b63f70827c6eb8ac8&', //川崎市歌 verA
                'https://cdn.discordapp.com/attachments/1312791757033046016/1353652691946962954/334melodyEsperanza.mp4?ex=67e26ecf&is=67e11d4f&hm=1cc26d0b2933b1e01385ac8c34cff17d78c179d0a7e3a4e11494afc164c8688e&', //Esperanza (希望の朝)
                ];
module.exports = {
	data: new SlashCommandBuilder()
		.setName('train')
		.setDescription('334に関する鉄道写真をランダムに送信します')
          .addStringOption(option =>
            option.setName('choice')
                .setDescription('train、melody')
                .setRequired(true)
                .addChoices(
                    { name: 'train', value: 'train' },
                    { name: 'melody', value: 'melody' }
                )),
	async execute(interaction) {
    const choice = interaction.options.getString('choice');
    if (choice === "train") {
      let autoreply = arrtr[Math.floor(Math.random() * arrtr.length)];
	  	await interaction.reply(autoreply);
    } else if (choice === "melody") {
      let autoreply = arrmelo[Math.floor(Math.random() * arrmelo.length)];
		  await interaction.reply(autoreply);
    } else {
      await interaction.reply('無効なchoiceです。');
    }
	},
};