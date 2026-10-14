// Reads feeds.json, fetches each RSS/Atom feed, and writes news.json (run by the GitHub Action).
import fs from "node:fs";
const dec=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&").trim();
const tag=(b,t)=>{const m=b.match(new RegExp(`<${t}(?:\\s[^>]*)?>([\\s\\S]*?)</${t}>`,"i"));return m?dec(m[1]):""};
const day=d=>d.toLocaleDateString("en-CA",{timeZone:"America/Los_Angeles"});
export function parse(xml,name){return [...xml.matchAll(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi)].slice(0,25).map(m=>{const b=m[0];
  let u=tag(b,"link");const h=b.match(/<link[^>]*href=["']([^"']+)["']/i);if(h)u=dec(h[1]);
  const dt=new Date(tag(b,"pubDate")||tag(b,"published")||tag(b,"updated")||tag(b,"dc:date"));
  return {d:isNaN(dt)?"":day(dt),s:name,t:tag(b,"title"),u}}).filter(i=>i.d&&i.t&&/^https?:/.test(i.u))}
if(process.argv[1]&&process.argv[1].endsWith("fetch-news.mjs")){
  const feeds=JSON.parse(fs.readFileSync("feeds.json","utf8"));
  let old={items:[]};try{old=JSON.parse(fs.readFileSync("news.json","utf8"))}catch{}
  const items=[];let fail=0;
  for(const f of feeds){try{
    const r=await fetch(f.u,{headers:{"User-Agent":"Mozilla/5.0 (compatible; BrewersToolkit/1.0)"}});
    if(!r.ok)throw new Error("HTTP "+r.status);
    const got=parse(await r.text(),f.n);if(!got.length)throw new Error("no articles found");
    items.push(...got);console.log("ok",f.n,got.length);
  }catch(e){fail++;console.log("FAILED",f.n,String(e.message||e));items.push(...(old.items||[]).filter(i=>i.s==f.n))}}
  const seen=new Set(),out=items.filter(i=>!seen.has(i.u)&&seen.add(i.u)).sort((a,b)=>b.d.localeCompare(a.d)).slice(0,300);
  const body={sources:feeds.map(f=>({n:f.n,u:f.u})),items:out};
  if(JSON.stringify({sources:old.sources,items:old.items})!==JSON.stringify(body))fs.writeFileSync("news.json",JSON.stringify({updated:new Date().toISOString(),...body}));
  if(fail===feeds.length){console.error("All feeds failed");process.exit(1)}
}
