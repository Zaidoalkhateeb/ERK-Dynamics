import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

const attempts = new Map<string,{count:number;reset:number}>();
const allowedTypes = new Set(["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","image/jpeg","image/png","image/webp"]);
const intents = new Set(["demo","quote","technical","support","partnership","general","contact","partner"]);

function clean(value:unknown,max=4000){return String(value??"").replace(/[<>\u0000-\u001F]/g," ").trim().slice(0,max)}
function reference(){const date=new Date().toISOString().slice(0,10).replaceAll("-","");return `ERK-${date}-${randomBytes(3).toString("hex").toUpperCase()}`}

export async function POST(request:NextRequest){
  try{
    const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"local";const now=Date.now();const entry=attempts.get(ip);if(entry&&entry.reset>now&&entry.count>=8)return NextResponse.json({error:"Too many requests. Please try again later."},{status:429});attempts.set(ip,{count:entry&&entry.reset>now?entry.count+1:1,reset:now+15*60_000});
    const type=request.headers.get("content-type")||"";const raw:Record<string,unknown>={};const files:File[]=[];
    if(type.includes("multipart/form-data")){const data=await request.formData();for(const [key,value] of data.entries()){if(value instanceof File){if(value.size){if(!allowedTypes.has(value.type)||value.size>10*1024*1024)return NextResponse.json({error:"A file type or size is not allowed."},{status:400});files.push(value)}}else raw[key]=value;}if(files.length>3)return NextResponse.json({error:"Maximum 3 files."},{status:400});}
    else Object.assign(raw,await request.json());
    if(raw.website)return NextResponse.json({ok:true,reference:reference()});
    const intent=clean(raw.intent||raw.type,40);const email=clean(raw.email,200);const country=clean(raw.country||raw.region,100);const firstName=clean(raw.firstName||raw.name,100);const lastName=clean(raw.lastName,100);const company=clean(raw.companyContact||raw.company||raw.organization,200);const message=clean(raw.message||raw.technicalQuestion||raw.issue,6000);
    if(!intents.has(intent)||!firstName||!company||!email||!country)return NextResponse.json({error:"Required fields are missing."},{status:400});if(!/^\S+@\S+\.\S+$/.test(email))return NextResponse.json({error:"Enter a valid business email address."},{status:400});
    const ref=reference();const safe:Record<string,string>={};for(const [key,value] of Object.entries(raw)){if(key!=="website")safe[clean(key,60)]=clean(value,key==="message"?6000:500)}safe.reference=ref;safe.submittedAt=new Date().toISOString();safe.route=({demo:"Sales / Product demonstration",quote:"Commercial team",technical:"Technical team",support:"After-sales support",partnership:"Business development"} as Record<string,string>)[intent]||"General inbox";
    const webhook=process.env.FORM_WEBHOOK_URL;if(webhook){const outgoing=new FormData();outgoing.set("payload",JSON.stringify(safe));for(const file of files)outgoing.append("files",file,file.name);const delivered=await fetch(webhook,{method:"POST",body:outgoing});if(!delivered.ok)throw new Error("Delivery failed");}else console.info("ERK request received — delivery webhook not configured",{reference:ref,intent,route:safe.route});
    return NextResponse.json({ok:true,reference:ref});
  }catch(error){console.error("ERK form delivery failed",error instanceof Error?error.message:"unknown");return NextResponse.json({error:"Unable to send the request."},{status:500})}
}
