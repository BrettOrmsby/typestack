"use strict";exports.id=538,exports.ids=[538],exports.modules={538:(r,t,s)=>{s.r(t),s.d(t,{default:()=>e});const e={int:{fromCharCode:{params:{code:"int"},rawCode:(r,t)=>{r.str.push(String.fromCharCode(t.code))}},fromCodePoint:{params:{code:"int"},rawCode:(r,t)=>{let s;try{s=String.fromCharCode(t.code)}catch(r){return new Error(`\`code\` is an invalid code point: \`${t.code}\``)}r.str.push(s)}},repeat:{params:{string:"str",amount:"int"},rawCode:(r,t)=>{if(t.amount<0)return new Error(`unable to repeat a negative \`amount\`: \`${t.amount}\``);r.str.push(t.string.repeat(t.amount))}},charAt:{params:{string:"str",index:"int"},rawCode:(r,t)=>{r.str.push(t.string.charAt(t.index))}},charCodeAt:{params:{string:"str",index:"int"},rawCode:(r,t)=>{const s=t.string.charCodeAt(t.index);if(isNaN(s))return new Error(`\`index\` out of range: \`"${t.string}"\`, \`${t.index}\``);r.int.push(s)}},codePointAt:{params:{string:"str",index:"int"},rawCode:(r,t)=>{const s=t.string.codePointAt(t.index);if(!s)return new Error(`\`index\` out of range: \`"${t.string}"\`, \`${t.index}\``);r.int.push(s)}},slice:{params:{string:"str",endIndex:"int",startIndex:"int"},rawCode:(r,t)=>{r.str.push(t.string.slice(t.startIndex,t.endIndex))}}},float:{},str:{endsWith:{params:{end:"str",string:"str"},rawCode:(r,t)=>{r.bool.push(t.string.endsWith(t.end))}},startsWith:{params:{start:"str",string:"str"},rawCode:(r,t)=>{r.bool.push(t.string.startsWith(t.start))}},includes:{params:{search:"str",string:"str"},rawCode:(r,t)=>{r.bool.push(t.string.includes(t.search))}},occurrence:{params:{search:"str",string:"str"},rawCode:(r,t)=>{r.int.push(t.string.split(t.search).length-1)}},toUpper:{params:{string:"str"},rawCode:(r,t)=>{r.str.push(t.string.toUpperCase())}},toLower:{params:{string:"str"},rawCode:(r,t)=>{r.str.push(t.string.toLowerCase())}},trim:{params:{string:"str"},rawCode:(r,t)=>{r.str.push(t.string.trim())}},reverse:{params:{string:"str"},rawCode:(r,t)=>{r.str.push(t.string.split("").reverse().join(""))}},replace:{params:{replacement:"str",search:"str",string:"str"},rawCode:(r,t)=>{r.str.push(t.string.replace(t.search,t.replacement))}},replaceAll:{params:{replacement:"str",search:"str",string:"str"},rawCode:(r,t)=>{r.str.push(t.string.replaceAll(t.search,t.replacement))}},repeat:{params:{string:"str",amount:"int"},rawCode:(r,t)=>{if(t.amount<0)return new Error(`unable to repeat a negative \`amount\`: \`${t.amount}\``);r.str.push(t.string.repeat(t.amount))}},indexOf:{params:{search:"str",string:"str"},rawCode:(r,t)=>{r.int.push(t.string.indexOf(t.search))}},lastIndexOf:{params:{search:"str",string:"str"},rawCode:(r,t)=>{r.int.push(t.string.lastIndexOf(t.search))}},charAt:{params:{string:"str",index:"int"},rawCode:(r,t)=>{r.str.push(t.string.charAt(t.index))}},charCodeAt:{params:{string:"str",index:"int"},rawCode:(r,t)=>{const s=t.string.charCodeAt(t.index);if(isNaN(s))return new Error(`\`index\` out of range: \`"${t.string}"\`, \`${t.index}\``);r.int.push(s)}},codePointAt:{params:{string:"str",index:"int"},rawCode:(r,t)=>{const s=t.string.codePointAt(t.index);if(!s)return new Error(`\`index\` out of range: \`"${t.string}"\`, \`${t.index}\``);r.int.push(s)}},slice:{params:{string:"str",endIndex:"int",startIndex:"int"},rawCode:(r,t)=>{r.str.push(t.string.slice(t.startIndex,t.endIndex))}},split:{params:{separator:"str",string:"str"},rawCode:(r,t)=>{t.string.split(t.separator).forEach((t=>r.str.push(t)))}}},bool:{},any:{}}}};